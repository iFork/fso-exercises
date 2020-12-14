import React from 'react';
import { render, fireEvent /* , act  */ } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import AddBlogForm from './AddBlogForm';

describe('<AddBlogForm />', () => {
  let createBlog;
  let toggleVisibility;
  let togglableRef;
  // let component;
  let promise;
  beforeEach(() => {
    // createBlog = jest.fn();
    promise = Promise.resolve();
    createBlog = jest.fn(() => promise);
    toggleVisibility = jest.fn();
    togglableRef = {
      current: { toggleVisibility },
    };
    render(<AddBlogForm
      createBlog={createBlog}
      togglableRef={togglableRef}
    />);
  });
  test(
    'Form is opened up and creation handler is called with correct input',
    async () => {
      // open up form
      fireEvent.click(screen.getByText(/add post/i));
      expect(screen.getByLabelText(/title/i)).toBeVisible();
      // enter data
      const blogTitle = 'My Blog Title';
      const blogAuthor = 'Bob';
      const blogUrl = 'http://coool.christmas';
      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: blogTitle },
      });
      fireEvent.change(screen.getByLabelText(/author/i), {
        target: { value: blogAuthor },
      });
      fireEvent.change(screen.getByLabelText(/url/i), {
        target: { value: blogUrl },
      });
      fireEvent.click(screen.getByText(/add post/i));
      // check arg passed
      await waitFor(() => {
        // NOTE: seems that failure of following is in the form of throwing
        // (uncaught) promise and not a nice report of what is deviated in the
        // received vs expected.
        // A: Yes, and it is due to error on `waitFor()`:
        // `TypeError: MutationObserver is not a constructor.`
        // Fixed with amending react test script with
        // `--env=jest-environment-jsdom-sixteen` or updating package.json
        // with npm-check-update utility.
        expect(createBlog).toHaveBeenCalledWith({
          title: blogTitle,
          author: blogAuthor,
          url: blogUrl,
        });
      });

      // NOTE: following (not being inside waitFor which itself wraps in act())
      // causes warning since `createBlog` is an async func causing state update
      // outside react's callstack.
      // `Warning: An update to AddBlogForm inside a test was not wrapped in act(...).`
      // Q: But `createBlog` is not called here, its call is only asserted here,
      // right? Why then the warning on missing act()?
      // A: It, maybe, is because async `createBlog` func is called and test is
      // not waiting its finish. Putting `await act(() => promise)` at the end
      // will **ensure that we are waiting till all state updates are settled**.
      //
      // expect(createBlog).toHaveBeenCalledWith({
      //   title: blogTitle,
      // });

      // NOTE: Q: Why tsserver wrongly flags (false positive) await keyword below?
      // Why it does not see that act() (can) return promise?
      // At first, flagging was correct due to having old package (not supporting
      // async act()). But error flag remained after major version upgrade, too.
      //
      // await act(async () => promise);
      // NOTE: act() warning is gone without above line if we wrap our async func
      // assertion (`expect(createBlog).`) inside `waitFor()` (which has act()
      // wrapped).
    },
  );
});
