module {
  // State is implicitly updated by the blob-storage component
  type Actor = {
    // Update to match persistent state
  };

  public func run(old : Actor) : Actor {
    old;
  };
};
