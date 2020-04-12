# sei-project-one-game
sei-project-one-game
pacman

< Rule >
  1. Move pacmab with allow keys and earn scores
  2. End the game if pacman is caught by a ghost
  3. Get special food and catch a ghost
  4. Your packman is level up if you win 3 rounds at level 5 in a row


< Game Logic >
  1. Food type - score - special mode
foodOne       +1    N
foodTwo       +5    Y   Catch a ghost
foodSpecial   +10   Y   Catch all the ghosts (foodSpecial shows up randomly for 5 sec)

  2. Ghost type
ghNorm  - run 1 div per 1 sec
ghFast  - run 2 div per 1 sec
ghSlow  - stop for 1 sec in every 3 sec 

  3. Game mode setting
    packman   ghost                         area       foodTwo    foodSpe   2 player mode
1 -   1         1 (norm)                     10x10           4        1           N
2 -   1         2 (norm)                     10x10           4        1           N
3 -   1         5 (norm2, fast, slow)        100x100         10       3           Y
4 -   1         8 (norm4, fast2, slow2)      100x100         10       3           Y
5 -   1         10 (norm4, fast 4, slow2)    100x100       10       3           Y

  4. Others
- sound on/off, volume


Assets

ref. packman game board design
https://hoopgame.net/play/Pac-Man-Online

music
https://downloads.khinsider.com/game-soundtracks/album/pac-man-gameboy
