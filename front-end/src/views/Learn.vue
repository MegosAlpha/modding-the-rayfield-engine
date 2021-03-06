<template>
  <div class="container">
    <h1>Learn</h1>
    <p>Welcome to the learn page! Let's get started.</p>
    <h2>How to Play</h2>
    <p>Rayfield games are quite simple to learn due to their unified control scheme. The developers note gamepad support; I haven't tested it, since the Gamepad API didn't work properly on my system. Note that South refers to the X button on DualShock controllers and the A button on Xbox controllers. Without further ado, here are the main inputs.</p>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Action</th>
          <th scope="col">Keyboard</th>
          <th scope="col">Controller</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Move Left and Right</td>
          <td>Left and Right Arrow Keys</td>
          <td>Left and Right on DPad</td>
        </tr>
        <tr>
          <td>Jump</td>
          <td>Space</td>
          <td>South</td>
        </tr>
        <tr>
          <td>Interact</td>
          <td>Up Arrow Key</td>
          <td>Up on DPad</td>
        </tr>
        <tr>
          <td>Advance Interaction</td>
          <td>Enter Key</td>
          <td>South</td>
        </tr>
        <tr>
          <td>Choose Dialogue Option</td>
          <td>Corresponding number key</td>
          <td>n/a (use keyboard)</td>
        </tr>
      </tbody>
    </table>
    <p>This table will be expanded as the engine adds new inputs. This is all you should need to play most modded games.</p>
    <h2>Rayfield Modding: An Overview</h2>
    <p>The Rayfield Engine is fairly unique for reasons mentioned on the Home page. Since the engine is closed-source, we'll opt to discuss the process of modding and apparent workings of the engine, rather than diving into engine internals. The moddable assets we care about are tilesets, tilemaps, and Purgatory files.</p>
    <p>A <strong>tileset</strong> is a file containing tiles (fixed-size sprites), which are used for almost everything in the modding process. The modding API currently splits the tileset into 8x8 tiles, numbered sequentially. To determine a tile ID quickly, we recommend using <a href="https://www.mapeditor.org/">Tiled Map Editor</a>.</p>
    <p>A <strong>tilemap</strong> is a JSON file that explains where each tile in a given map should be located and on what layer. The Rayfield Engine uses layers of the tilemap to store important information, including scripted entities and their assigned movement or dialogue. Once again, we recommend using Tiled Map Editor. The Rayfield engine runs at a 320x152 resolution, and therefore tilemaps are anticipated to be at that size.</p>
    <p><strong>Purgatory files</strong> are a type of file written in the Purgatory Graph Language (the compiler of which is also closed-source and proprietary). It's both simple and bizarre as a language, albeit a bit flaky at times. Maintaining Purgatory code can be tricky and tedious, but I'd imagine it's less so than writing the equivalent into the engine directly. Plus, it is an easy way to mod existing Rayfield games.</p>
    <h2>A Primer on the Purgatory Graph Language</h2>
    <p>The Purgatory Graph Language is a two-part, tag-based language that represents graphs.</p>
    <h3>Content (Nodes)</h3>
    <p>A node in our graph is represented by a single line. If it begins with a tag like <code>[my_tag]</code>, the node may be referred to by "my_tag" in the Postscript. Otherwise, the line should start with <code>&gt;</code>; in this case, the node is referred to by its line number. Due to pecularities and instability in the modding API, we recommend tagging every node. In some Purgatory files, the engine uses the name of the tag to access the behavior.</p>
    <p>Most of the power of Purgatory comes from <strong>attached behavior</strong>. By writing <code>run</code> on the line beneath a given node, one opens a code block that will be executed upon navigation to the node. The same block is ended with the keyword <code>nur</code>, also on its own line. The code inside the block is written in the <a href="https://www.rust-lang.org/">Rust programming language</a>, an odd choice for a game engine given its compiled and fairly technical nature. Knowledge of Rust is not required for these docs, but can be helpful. As a convenient shorthand, writing text on the same line as the tag causes that text to emerge at the end of the node's execution.</p>
    <h3>Postscript (Edges)</h3>
    <p>Placing a format line switches the compiler phase, explaining to the compiler how you, the modder, will be defining the connections between the nodes defined in the content section. The commonly-used format specifiers are:
      <ul>
        <li><code>!none</code>, where no edges are to be defined.</li>
        <li><code>!relation</code>, the ordered-pair format (tagA, tagB) where tagA is adjacent to tagB.</li>
        <li><code>!conditional relation</code>, the tuple format (tagA, condition, tagB) where tagA is adjacent to tagB if and only if the Rust condition evaluates to true. Ordered pairs are still valid in this format and function as though the condition were implicitly true.</li>
      </ul>
    </p>
    <p>There are some other changes to the format specifier that we'll discuss below.</p>
    <h3>The <code>data</code> parameter</h3>
    <p>Purgatory code has implicit access to a <code>data</code> object. We will look into these objects more through examples.</p>

    <h2>Purgatory Use in Accessible Modding Systems</h2>
    <p>Let's break down a few systems, in order of complexity / difficulty.</p>
    <h3>Mapping</h3>
    <p>Mapping is the simplest Purgatory system available to the engine. Every node is tagged, but also devoid of both text and attached behavior by default. The Rayfield engine uses a cardinal exit system, meaning it automatically detects the up, down, left, and right exits of a map. Connecting those exits to another map's entrance is the main reason Purgatory format is used for this system.</p>
    <p>Example:
      <pre><code>[map1_left]
[map2_right]
!relation: symmetric
(map1_left, map2_right)</code></pre>
    </p>

    <p>This block defines the left entrance and exit on the map named "map1" as well as the right entrance and exit on the map named "map2". The format specifier uses the symmetric closure indicator, which means that the graph will be made symmetric. In other words, we have shorthand for <code>(map1_left, map2_right), (map2_right, map1_left)</code> so that the player can travel between either map. Map names derive from the filename: the left transition of "map1.json" will load the player into the right transition of "map2.json".</p>

    <h3>Dialogue (Legacy)</h3>
    <p>Purgatory looks tailor-made for dialogue, though the conditional dialogue format is almost essential to the current dialogue system. Original dialogue is still quite simple.</p>
    <p>Example:
      <pre><code>[hello] Char: Hello!
[pleasantry] Char: How are you?
[pc_good] Good.
[pc_bad] Bad.
[char_good_response] Char: Good!
[char_bad_response] Char: Ah.
[char_end] Char: ...The weather sure is nice today.
!relation
(hello, pleasantry), (pleasantry, pc_good), (pleasantry, pc_bad), (pc_good, char_good_response), (pc_bad, char_bad_response), (char_good_response, char_end), (char_bad_response, char_end)</code></pre>
    </p>

    <p>This block creates a conversation in which a character named Char greets you and asks you how you are doing. The game engine implicitly knows when to offer the player a choice, since it notices that pleasantry is adjacent to two different nodes. Upon making the choice, Char responds accordingly, and eventually the two paths once again convene.</p>

    <p>This version of the dialogue system is fine, but has one glaring oversight -- what happens if a player should not be presented with all of the choices? What if we want some choices to only appear under certain conditions? Legacy dialogue could be refitted to account for this via some attached behavior tricks, but the conditional dialogue format is much more clear.</p>

    <h3>Conditional Dialogue</h3>
    <p>With Conditional Dialogue comes the <code>data</code> object, and not the enjoyable parts of the <code>data</code> object either. The Rayfield Engine's approximation of an entity-component system, <code>data.msm</code>, is what we're up against. For more experienced Rust users, <code>data.msm</code> appears to have type <code>Option&lt;&'a RefCell&lt;Data&gt;&gt;</code> where <code>Data</code> is some internal struct. This means actually accessing the data is cumbersome. For this reason, we will discuss solely handling the player's financials.</p>

    <p>Example:
      <pre><code>[greeting] Char: Greetings!
[pc_neutral] May I have a loan?
run
data.msm.unwrap().borrow_mut().player.money += 100;
nur
[pc_godspeed] I'm rich!
[char_surprise] Oh! Indeed!
!conditional relation
(greeting, pc_neutral), (greeting, data.msm.unwrap().borrow().player.money > 400, pc_godspeed), (pc_godspeed, char_surprise)
</code></pre>
    </p>

    <p>This dialogue would proceed as a simple "Greetings!" followed by "May I have a loan?" unless the player has more than $400. In that case, the player is free to choose the second option and elicit a surprised response from Char. Note that this script will not work as-is, since there is no node with a magic name (see below).</p>

    <h3>AI / Scripted Movement / Animation</h3>
    <p>This is where we have the last major trick of Purgatory -- return overrides. Attached behavior executes within a function that returns a <code>String</code>. The animation engine waits for a function to return <code>"DONE"</code>, at which point updates to the object are suspended. The key function to simplify the movement process is <code>data.bmove</code>, which takes distance, direction, and speed, returning <code>false</code> when done moving. This script is executed every frame, so it should be light on computations for best performance.</p>
    <p>Example:
      <pre><code>[map_30]
run
if !data.bmove(30., Direction::Left, 10.) {
    return String::from("DONE");
}
nur
!none</code></pre>
    </p>

    <p>This block moves the entities on the map titled "map" marked for movement by tile 30 a total of 30 units to the left, at a rate of 10 units per second. The decimal points are important, and the engine does support moving decimal amounts.</p>

    <p>One more note: multi-step animations are possible with the engine. Using the postscript, once <code>"DONE"</code> is received, the engine will move to the next adjacent node.</p>

    <h2>Layer-based Map Markup and Design</h2>
    <p>Every map must have a layer titled "main layer" and a layer titled "spawn layer". The <strong>main layer</strong> consists solely of static objects, which are fixed in place and rendered immediately.</p>
    <p>The <strong>spawn layer</strong> is a markup layer, meaning it is never rendered by the engine, and contains only tiles with ids 26 through 29. These tiles are used to mark the cardinal entrances of the map, where conventionally, tile 26 is placed at the left, tile 27 at the right, tile 28 at the top, and tile 29 at the bottom. The game uses these as spawn locations. It is not required to use all the tiles in a given map, and the flexibility of the navigation script means left, right, up, and down are more entrance names than obligations.</p>
    <p>The <strong>entity layer</strong> contains tiles that are not necessarily static (ready for dialogue and/or movement). Tiles in the entity layer are invisible by default, but are visible and granted collision if attached to movement and/or dialogue.</p>
    <p>The <strong>dialogue layer</strong> is a markup layer to designate which lines of dialogue should be granted to which entities. Any tile can be used in the dialogue layer. The <strong>movement layer</strong> is exactly the same way, but designates movement and is less entity-specific than the dialogue system; all entities that have the same background tile in the movement layer will have the same movement.</p>

    <h2>Magic Names and the Art of Connecting the Map Editor to Purgatory</h2>
    <p>For every script, the engine relies on IDs and filenames to apply Purgatory behavior to the underlying maps. The specific combination of said IDs and filenames determines "magic names". Each script has a slightly different approach:</p>

    <ul>
      <li>Conditional Dialogue (condialogue): mapname_entityID_tileOnDialogueLayerID</li>
      <li>Movement (basic_ai): mapname_tileOnMovementLayerID</li>
      <li>Mapping (navigator): mapname_(left/right/up/down)</li>
    </ul>

    <p>Naming the root node of dialogue, the root of movement, or every node in navigation with a magic name informs the engine of where to start, leaving the engine open to fairly significant modding efforts.</p>

  </div>
</template>

<script>
  export default {
    name: 'Learn',
    components: {}
  }
</script>
