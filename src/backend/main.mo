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
import Migration "migration";

// specify the data migration function in with-clause
(with migration = Migration.run)
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

  // Example initial stories
  let initialStories = [
    {
      title = "Creation";
      summary = "God creates the heavens and the earth";
      verses = [{
        reference = "Genesis 1:1";
        text = "In the beginning God created the heavens and the earth.";
        testament = #old;
        image = null;
      }];
      image = null;
    },
    {
      title = "Jesus Feeds 5000";
      summary = "Jesus feeds a large crowd with five loaves and two fish";
      verses = [
        {
          reference = "Matthew 14:19";
          text = "Taking the five loaves and the two fish and looking up to heaven, he gave thanks and broke the loaves.";
          testament = #new;
          image = null;
        },
        {
          reference = "John 6:11";
          text = "Jesus then took the loaves, gave thanks, and distributed to those who were seated as much as they wanted.";
          testament = #new;
          image = null;
        },
      ];
      image = null;
    },
    {
      title = "Ten Commandments";
      summary = "God gives Moses the Ten Commandments on Mount Sinai";
      verses = [
        {
          reference = "Exodus 20:1";
          text = "And God spoke all these words:";
          testament = #old;
          image = null;
        },
        {
          reference = "Exodus 20:2-3";
          text = "I am the Lord your God, who brought you out of Egypt, out of the land of slavery. You shall have no other gods before me.";
          testament = #old;
          image = null;
        },
        {
          reference = "Exodus 20:12";
          text = "Honor your father and mother.";
          testament = #old;
          image = null;
        },
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

  // Upload Story or Verse Image (Admin Only) - Now Publicly Viewable
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
