# Modding the Rayfield Engine

This is the source code for a site that teaches users how to mod an instance of the closed-source Rayfield Game Engine via publically-available Web APIs. In other words, this is the documentation and community use layer of a multiplayer platforming game generation service.

## Wait, multiplayer?
Yes. Rayfield Engine games, at least on platforms supporting UDP sockets, implement multiplayer automatically. Your player should appear on the screens of all other players using the same modded version, given that the server is functioning as expected and that your computer is able to connect to it. Since the Rayfield Engine only recently launched its alpha-stage WASM support, note that multiplayer in the browser may not function well (if at all).

On a similar note, alpha-stage WASM support means performance and asset-loading issues are not unheard of. There's also little vetting applied to generator code. Play modded builds at your own risk.

## Notes
The Rayfield Engine and some of its components are currently proprietary. Thus, compilation of Rayfield games is highly restricted. The compilation API used by this project currently provides only WASM builds due to its containment standards, maximizing user safety.

