import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  // Include components
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Data Types
  public type Testament = { #old ; #new };

  public type Verse = {
    reference : Text;
    text : Text;
    testament : Testament;
    image : ?Storage.ExternalBlob;
  };

  public type Story = {
    title : Text;
    summary : Text;
    verses : [Verse];
    image : ?Storage.ExternalBlob;
  };

  // Initialize stories with entries.
  let initialStories : [Story] = [
    {
      title = "Creation";
      summary = "God creates the heavens and the Earth.";
      verses = [
        {
          reference = "Genesis 1:1";
          text = "In the beginning God created the heavens and the earth.";
          testament = #old;
          image = null;
        }
      ];
      image = null;
    },
    {
      title = "Moses and Exodus";
      summary = "Moses leads the Israelites out of Egypt.";
      verses = [
        {
          reference = "Exodus 14:21";
          text = "Moses stretched out his hand over the sea, and the LORD drove the sea back with a strong east wind.";
          testament = #old;
          image = null;
        }
      ];
      image = null;
    },
    {
      title = "Jesus Walks on Water";
      summary = "Jesus walks on water, demonstrating his divinity to the disciples.";
      verses = [
        {
          reference = "Matthew 14:25";
          text = "Shortly before dawn Jesus went out to them, walking on the lake.";
          testament = #new;
          image = null;
        }
      ];
      image = null;
    },
  ];

  var stories : [Story] = initialStories;

  module Helper {
    public func compare(a : Verse, b : Verse) : Order.Order {
      Text.compare(a.reference, b.reference);
    };
  };

  // Upload Story or Verse Image (Admin Only)
  public shared ({ caller }) func uploadStoryOrVerseImage(blob : Storage.ExternalBlob, isStory : Bool, index : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can upload images");
    };
    if (index >= stories.size()) { Runtime.trap("Invalid index") };

    var updatedStories = stories.toVarArray<Story>();

    if (isStory) {
      let story = stories[index];
      updatedStories[index] := { story with image = ?blob };
    } else {
      var story = stories[index];
      var updatedVerses = story.verses.toVarArray<Verse>();
      if (updatedVerses.size() > 0) {
        let firstVerse = story.verses[0];
        updatedVerses[0] := { firstVerse with image = ?blob };
        story := { story with verses = updatedVerses.toArray() };
        updatedStories[index] := story;
      };
    };
    stories := updatedStories.toArray();
  };

  // Get Stories (Public)
  public query func getStories() : async [Story] {
    stories;
  };

  // Get Verses by Testament (Public)
  public query func getVersesByTestament(testament : Testament) : async [Verse] {
    let allVerses = stories.values().flatMap(func(story) { story.verses.values() }).toArray();
    let filteredVerses = allVerses.filter(func(verse) { verse.testament == testament });
    filteredVerses.sort();
  };

  // Get Daily Verse (Public)
  public query func getDailyVerse() : async Verse {
    let curatedVerses = [
      {
        reference = "John 3:16";
        text = "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.";
        testament = #new;
        image = null;
      },
      {
        reference = "Philippians 4:13";
        text = "I can do all things through Christ who strengthens me.";
        testament = #new;
        image = null;
      },
      {
        reference = "Psalm 23:1";
        text = "The Lord is my shepherd, I shall not want.";
        testament = #old;
        image = null;
      },
      {
        reference = "Romans 8:28";
        text = "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.";
        testament = #new;
        image = null;
      },
      {
        reference = "Joshua 1:9";
        text = "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.";
        testament = #old;
        image = null;
      },
    ];

    let now = Time.now();
    let secondsPerDay = 86_400_000_000_000;
    let day = now / secondsPerDay;
    let index = (day % curatedVerses.size()).toNat();

    curatedVerses[index];
  };

  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };
};

