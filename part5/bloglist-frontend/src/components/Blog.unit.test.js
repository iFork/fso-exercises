import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen, prettyDOM } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import Blog from './Blog';

describe('<Blog />', () => {
  let blog;
  let updateBlog;
  let deleteBlog;
  let currentUsername;
  let user;
  let component;
  beforeEach(() => {
    user = {
      name: 'Joe Doe',
      username: 'joe',
      id: '001',
    };
    blog = {
      title: 'Test blog title',
      author: 'John Doe',
      likes: 1,
      url: 'coolurl',
      user,
    };
    currentUsername = user.name;
    updateBlog = jest.fn();
    deleteBlog = jest.fn();
    component = render(
      <Blog
        blog={blog}
        updateBlog={updateBlog}
        deleteBlog={deleteBlog}
        currentUsername={currentUsername}
      />,
    );
  });
  test('Initial view shows titlte and author', () => {
    // NOTE: getByText(string), by default, is an exact matcher, so to match
    // you need to provide full exact content of the node.
    // E.g. '23' is the exact matcher of <div> 2<span>-</span>3 </div>
    // See issue [getByText ignoring text in html tags · Issue #410 ·
    // testing-library/dom-testing-library]
    // (https://github.com/testing-library/dom-testing-library/issues/410)
    //
    // partial matching w exact: false
    expect(component.getByText(blog.title, { exact: false }))
      .toBeInTheDocument();
    // or
    // expect(component.container).toHaveTextContent(blog.title);
    // or
    // expect(screen.getByText(/test blog title/i)).toBeInTheDocument();

    expect(screen.getByText(blog.author, { exact: false }))
      .toBeInTheDocument();

    // or
    // Following passes as text is full (normalized) content of the div
    // excluding nested element (button):
    expect(screen.getByText(`${blog.title} ${blog.author}`))
      .toBeInTheDocument();
  });
  test('Initial view hides details', () => {
    // NOTE: .not.toBeVisible() matcher does not fit the bill as here we have
    // conditional rendering, not hidden via css.
    // NOTE: Make sure that you pass a string (or regex) to a matcher,
    // not number or object. Otherwise you get
    // `TypeError: matcher.test is not a function`
    // Convert number to string in a matcher.
    expect(screen.queryByText(String(blog.likes), { exact: false }))
      .not.toBeInTheDocument();
    expect(screen.queryByText(blog.url, { exact: false }))
      .not.toBeInTheDocument();
    expect(screen.queryByText(blog.user.name, { exact: false }))
      .not.toBeInTheDocument();
  });
  test('Details are displayed after button to view details is clicked', () => {
    fireEvent.click(screen.getByTestId('viewExpander'));
    expect(screen.queryByText(String(blog.likes), { exact: false }))
      .toBeInTheDocument();
    expect(screen.queryByText(blog.url, { exact: false }))
      .toBeInTheDocument();
    expect(screen.queryByText(blog.user.name, { exact: false }))
      .toBeInTheDocument();
  });
  test('Like (update) handler is called as many times as like is clicked', () => {
    // open up detailed view to see like button
    fireEvent.click(screen.getByTestId('viewExpander'));
    fireEvent.click(screen.getByText('Like'));
    fireEvent.click(screen.getByText('Like'));
    expect(updateBlog).toHaveBeenCalledTimes(2);
  });
});
