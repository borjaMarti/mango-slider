# Mango Slider

`<Range />` component with support for a fixed and open range of value and accessibility focused.

### Demo Site

[https://mango-slider.vercel.app](https://mango-slider.vercel.app)

## Development Process

In the development process, my main priorities (other than the assignment’s requirements) have been:

- Clean code.
- Robust code.
- Accessibility.

### Clean Code

To me, clean code means maintainable code.

The project is structured to follow the principle of separation of concerns. To that end, I use [CSS Modules](https://github.com/css-modules/css-modules) to encapsulate the components’ styling. Elements of the `<Range />` component that are reused have been componentized (`<RangeInput />` and `<RangeThumb />`), and the slider logic is kept in the `useSlider` hook.

Consistent code formatting is enforced via [Prettier](https://prettier.io/).

### Robust Code

Robust code is linted, validated, and tested.

Next.js implements [ESLint](https://eslint.org/) by default, and strict TypeScript linting is followed.

The data returned from the API is parsed and validated using [Zod](https://zod.dev/) to ensure correct data structures at runtime.

Finally, [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) are used to run tests for the component functionality and the API and utility functions, while [Mock Service Workers](https://mswjs.io/) handles the API mocking.

### Accessibility

To ensure the component is accessible to as many users as possible, I’ve built it following W3C’s ARIA Authoring Practices Guide [Slider Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) and [Multi-Thumb Slider Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/). This means using the appropriate aria attributes for the controllable elements as well as making the component keyboard accessible.

## Improvements

There are two lines of improvements I’d follow if I had more time for the project:

- Functionality.
- Testing.

### Functionality

At the moment, the component values can't be controlled from its parent. To be useful, the control should implement props for the start and end values, as well as for a handler function, such as `onValueChange`.

Another thing that would improve its functionality would be `step` prop to control the step amount of the value.

### Testing

The testing could be improved with a more comprehensive list of tests, covering more edge cases.

With more time, I'd use an end-to-end test framework like [Playwright](https://playwright.dev/) to test the functionality on an environment that more closely resembles the browser.

## Project Setup

```sh
npm install
```

For the purpose of this assignment a `.env` file is already included with the necessary API endpoint.

### Start Project

```sh
npm run start
```

**Note:**
Due to an SSL certificate issue with the API provider ([mockable.io](https://www.mockable.io/)), Node.js might be unable to verify the intermediary certificates and the fetching will fail with a `UNABLE_TO_VERIFY_LEAF_SIGNATURE ` error.
To circumvent this, the project can be started on the local environment with the following option:

```sh
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run dev
```

### Run Tests

```sh
npm run test
```
