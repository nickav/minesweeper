# Minesweeper

#### _A simple minesweeper game made in React_

## Getting started

Install [yarn][yarn-install]. Then in this project directory run:

```bash
yarn
```

This will install all the project dependencies. When adding new dependencies, be
sure to also commit the `yarn.lock` file. Read more about [Managing Dependencies][yarn-deps].

## Developing

Keep this running in the background:

```bash
yarn start
```

Now navigate to [http://localhost:8080](http://localhost:8080) to view the app.

## Workflow

### Auto-generating files

The following [pinkprint][pinkprint] commands are available:

```bash
yarn g component folder/NewComponent
yarn g store foo
yarn g style fancy
yarn g helper maths
```

## Best Practices

### JavaScript

Prefer absolute imports instead of relative, upwards navigation. Relative
downwards imports are also fine.

```js
// Good
import Button from '@/components/Button';

// Bad
import Button from '../../components/Button';

// OK but not preferred
import Button from './stuff/Button';
```

### CSS

Any global styles should go directly in the `style` directory.
From an scss file you can import any file in the `style/globals` directory. For example:

```css
@import 'colors';
```

## Code Formatting

To format your code run:

```bash
yarn format
```

Thanks to [Husky][husky], this will be run automatically when you commit. To
disable this temporarily, run `git commit -n` which will skip all git hooks
for that commit. Try not to make a habit of it, though.

The commit hooks are defined in the `scripts` section of the `package.json`.

## Building

Create a production build of the app:

```bash
yarn dist
```

## Features

- [React][react] with [React Hotloader][react-hotloader] for live previews
- [SCSS][scss] to keep our CSS sane
- [Webpack][webpack] to build and run the project

## Project Structure

```bash
├── bin/                    # Webpack builds the static site into this directory
└── public/                 # Public files that get shipped
    ├── fonts/              # Font files
    └── img/                # Images and SVGs
└── src/                    # All source code
    └── components/         # React components
        ├── Component.jsx   # React component file
        └── Component.scss  # Style sheet for react component
    └── helpers/            # Helper files
        ├── history.js      # Browser history singleton
        └── functions.js    # General-purpose helper functions
    └── store/              # Base redux files and reducers
        ├── index.js        # Redux store singleton
        └── reducer.js      # Root reducer
    └── style/              # Common stylesheets
        ├── globals/        # Global variables and mixins
        └── lib/            # 3rd party vendor code
    ├── index.html          # App HTML page using lodash template
    ├── index.jsx           # App entry point
    └── index.scss          # SCSS entry point
├── package.json            # Defines dependencies and build scripts
├── webpack.config.js       # Main build file
└── README.md               # This file
```

[husky]: https://github.com/typicode/husky
[react]: https://facebook.github.io/react/
[pinkprint]: https://github.com/nickav/pinkprint
[react-hotloader]: https://github.com/gaearon/react-hot-loader
[prettier]: https://github.com/prettier/prettier
[scss]: http://sass-lang.com/
[webpack]: https://webpack.github.io/
[node]: https://nodejs.org/en/
[yarn-install]: https://yarnpkg.com/lang/en/docs/install/
[yarn-deps]: https://yarnpkg.com/lang/en/docs/managing-dependencies/
[redux]: https://github.com/reduxjs/redux
