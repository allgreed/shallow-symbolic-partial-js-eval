let
  pkgs = import (builtins.fetchGit {
    url = "https://github.com/nixos/nixpkgs/";
    ref = "refs/heads/nixos-unstable";
    rev = "61a8a98e6d557e6dd7ed0cdb54c3a3e3bbc5e25c"; # 6-12-2022
    # obtain via `git ls-remote https://github.com/nixos/nixpkgs nixos-unstable`
  }) { config = {}; };
in
pkgs.mkShell {
  buildInputs =
  with pkgs;
  [
    git
    gnumake
    yarn
    nodejs-16_x
    entr
  ];
}
