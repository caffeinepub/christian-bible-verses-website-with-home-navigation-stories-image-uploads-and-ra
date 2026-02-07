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

  let initialStories : [Story] = [
    {
      title = "Creation";
      summary = "God creates the heavens and the Earth.";
      verses = [
        {
          reference = "Genesis 1:1-3";
          text = "In the beginning God created the heaven and the earth. And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters. And God said, Let there be light: and there was light. (KJV)";
          testament = #old;
          image = null;
        },
        {
          reference = "Genesis 1:26-27";
          text = "And God said, Let us make man in our image, after our likeness... So God created man in his own image, in the image of God created he him; male and female created he them. (KJV)";
          testament = #old;
          image = null;
        },
      ];
      image = null;
    },
    {
      title = "Noah's Ark";
      summary = "Noah builds an ark to survive the great flood.";
      verses = [
        {
          reference = "Genesis 6:13-14";
          text = "And God said unto Noah... Make thee an ark of gopher wood; rooms shalt thou make in the ark. (KJV)";
          testament = #old;
          image = null;
        },
        {
          reference = "Genesis 7:1";
          text = "And the LORD said unto Noah, Come thou and all thy house into the ark... (KJV)";
          testament = #old;
          image = null;
        },
        {
          reference = "Genesis 8:1";
          text = "And God remembered Noah, and every living thing, and all the cattle that was with him in the ark: and God made a wind to pass over the earth, and the waters assuaged. (KJV)";
          testament = #old;
          image = null;
        },
      ];
      image = null;
    },
    {
      title = "Moses and the Exodus";
      summary = "Moses leads the Israelites out of Egypt.";
      verses = [
        {
          reference = "Exodus 14:21-22";
          text = "And Moses stretched out his hand over the sea... and the LORD caused the sea to go back by a strong east wind... And the children of Israel went into the midst of the sea upon the dry ground. (KJV)";
          testament = #old;
          image = null;
        },
        {
          reference = "Exodus 14:28";
          text = "And the waters returned, and covered the chariots, and the horsemen, and all the host of Pharaoh... (KJV)";
          testament = #old;
          image = null;
        },
      ];
      image = null;
    },
    {
      title = "The Birth of Jesus";
      summary = "The miraculous birth of Jesus Christ.";
      verses = [
        {
          reference = "Luke 2:6-7";
          text = "And so it was, that, while they were there, the days were accomplished that she should be delivered. And she brought forth her firstborn son, and wrapped him in swaddling clothes, and laid him in a manger... (KJV)";
          testament = #new;
          image = null;
        },
        {
          reference = "Matthew 2:1-2";
          text = "Now when Jesus was born in Bethlehem of Judaea in the days of Herod the king... behold, there came wise men from the east to Jerusalem, Saying, Where is he that is born King of the Jews?... (KJV)";
          testament = #new;
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
        text = "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life. (KJV)";
        testament = #new;
        image = null;
      },
      {
        reference = "Philippians 4:13";
        text = "I can do all things through Christ which strengtheneth me. (KJV)";
        testament = #new;
        image = null;
      },
      {
        reference = "Psalm 23:1";
        text = "The LORD is my shepherd; I shall not want. (KJV)";
        testament = #old;
        image = null;
      },
      {
        reference = "Romans 8:28";
        text = "And we know that all things work together for good to them that love God, to them who are the called according to his purpose. (KJV)";
        testament = #new;
        image = null;
      },
      {
        reference = "Joshua 1:9";
        text = "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest. (KJV)";
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
