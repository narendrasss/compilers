# Todos

- Figure out how to extract the location of the cursor out of the current editor
  - The `onDidChangeCursorPosition` function can be used to listen to cursor position changes
    - This returns an object of `column` - `line` pairs
  - What I actually need to figure out is the current context of the cursor
    - Is the cursor inside a function?
    - Is there a way for me to do this without needing to compile to an AST?
  - Use `model.getValueInRange()`
    - This returns the text, but then I have to parse that into an AST to find the function it belongs to??
    - What regex should I do to find the text though
    - Regex is too hard lol
  - **How do I get the current node?** Maybe I can keep a record of all valid node types, and search for matches for those node types?
    - Find matches for all PascalCased characters
      - regex: `([A-Z][a-z0-9]+)+`
      - This regex doesn't seem to work using `findMatches`
        - The example playground even converts the text into a string first before matching for a particular regex
    - Get the text up to the current cursor
    - Find an instance of `visitor: {` and get the text that comes after that
    - Find the last instance that matches the pascal case regex
    - Map these matches to positions
    - Using the current cursor position, get the first match _before_ the current position
  - Get rid of the last two curly brackets — how do you match for code between the `visitor: {` part?
    - I cant figure out how to limit the cursor to the stuff between the `visitor: {` — looking to fix that later
- Highlight parts of the input editor when there is an active node
  - Got basic highlighting working
  - How to remove old decorations?
    - Keep the current decorations in a ref

## MVP Scope

- Highlight AST nodes when the cursor is in that part of the visitor ✅
- Highlight lines in input code when an AST node is highlighted ✅
- Update output code as input code is changed ✅
- Show diff in output code ✅
  - Make this a toggle so the diff editor isn't always displayed
- Right click a node type to add the type to the visitor
- Update output code as plugin code is changed
- Add loading indicator for debounced values (i.e. AST and output code)
- Highlight AST node when cursor updates in input code
- Make the AST more aesthetic
  - Copy over the AST component from the debugger post
- Some kind of static analysis???
- Visualize a path? (path over node?)