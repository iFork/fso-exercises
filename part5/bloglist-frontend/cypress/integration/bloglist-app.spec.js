describe('Bloglist app', function () {
  const userA = {
    username: 'userA',
    name: 'Amy',
    password: 'passA',
    blogs: [
      {
        title: 'Test Title 1',
        author: 'Test Author',
        url: 'http://test.url',
      },
      {
        title: 'Test Title 2',
        author: 'Test Author',
        url: 'http://test.url',
        likes: 3,
      },
      {
        title: 'Test Title 3',
        author: 'Test Author',
        url: 'http://test.url',
        likes: 5,
      },
      {
        title: 'Test Title 4',
        author: 'Test Author',
        url: 'http://test.url',
        likes: 4,
      },
    ],
  };
  const userB = {
    username: 'userB',
    name: 'Bob',
    password: 'passB',
  };
  beforeEach(function () {
    // clear db with api for testing
    cy.request('POST', '/api/testing/reset');
    // seed db with users
    cy.createUser(userA);
    cy.createUser(userB);
    cy.visit('/');
  });
  describe('Login', function () {
    it('Succeeds with correct credentials', function () {
      // cy.contains(/username/i).parent().within(() => {
      //   cy.get('input').type('root');
      // });
      cy.get('#id_username').type(userA.username);
      cy.get('#id_password').type(userA.password);
      cy.contains(/login/i).click();

      cy.contains(/logged in as/i)
        .should('have.class', 'successNotification');
    });
    it('Fails with wrong credentials with error message', function () {
      cy.get('#id_username').type(userA.username);
      cy.get('#id_password').type(`wrong${userA.password}`);
      cy.contains(/login/i).click();

      cy.contains(/invalid/i)
        .should('have.class', 'errorNotification')
        .and(
          'have.css',
          'border-color',
          'rgb(255, 0, 0)',
        );

      cy.get('html').should('not.contain', /logged in as/i);
    });
  });
  describe('When logged in as userA', function () {
    beforeEach(function () {
      // login with api, not UI
      cy.login(userA);
    });
    it('A blog can be created', function () {
      // cy.contains(/add blog/i).click();
      cy.get('[data-testid=add-blog__toggle]').click();
      // cy.contains(/title/i).parent().within(() => {
      //   cy.get('input').type('x');
      // });
      cy.get('#id_title').type('Test Title');
      cy.get('#id_author').type('Test Author');
      cy.get('#id_url').type('http://test.url');
      cy.contains(/add post/i).click();

      cy.get('.blog.compactView')
        .contains('Test Title').contains('Test Author').contains(/view/i);
    });
    describe('And userA already has blogs', function () {
      beforeEach(function () {
        userA.blogs.forEach((blog) => {
          cy.createBlog(blog);
        });
        // reload page to get updated blog list
        cy.visit('/');
      });
      it('userA can like her blog', function () {
        cy.get('.blog.compactView')
          // .contains(/view/i).click();
          .contains(userA.blogs[0].title).within(() => {
            // expand blog
            // TODO: existing data-testid values do not follow BEM naming
            // convention, modifying it in component code will break also jest unit tests.
            cy.get('[data-testid=viewExpander]').click();
          });
        cy.get('.blog.detailedView')
          .contains(userA.blogs[0].title).within(() => {
            cy.contains(/likes/i).contains('0');
            // from buttons get one that contains 'like'
            cy.get('button').contains(/like/i).click();
            cy.contains(/likes/i).contains('1');
          });
      });
      it('userA can delete her blog', function () {
        cy.get('.blog.compactView')
          .contains(userA.blogs[0].title).within(() => {
            cy.get('[data-testid=viewExpander]').click();
          });
        cy.get('.blog.detailedView')
          .contains(userA.blogs[0].title).within(() => {
            cy.get('button').contains(/delete/i).click();
          });

        cy.get('.blog')
          .contains(userA.blogs[0].title).should('not.exist');
      });
      it('Blogs are sorted by likes in descending order', function () {
        // expand all blogs
        // cy.get('.blog.compactView')
        //   .each(($blog) => {
        //     cy.wrap($blog).within(() => {
        //       cy.get('[data-testid=viewExpander]').click();
        //     });
        //   });
        // Or, alternatively:
        cy.get('[data-testid=viewExpander]').click({ multiple: true });

        // get likes
        cy.get('.blog.detailedView')
          .then(($blogs) => {
            // NOTE: Pay Attention to the *Signature of the callback* of
            // jQuery's .map()
            const likes = $blogs.map((_i, blog) => {
              // NOTE: 2nd arg of the callback or `this` in this callback are DOM
              // elements, not jQuery objects. Wrap it in jQuery for jQuery
              // interface, e.g. `$(this).text()`.
              // TODO?: write as anon func, not arrow to not get involved with `this` nuances

              const regexpLikes = /likes\s*(\d+)/;

              // NOTE: call Cypress's jQuery like `cy.$$() or (for full jQuery)
              // `Cypress.$()` and construct new jQuery object
              // NOTE: following (cy.$$()) is synchronous jQuery, not async
              // cypress therefore I assign its return value
              // eslint-disable-next-line cypress/no-assigning-return-values
              const match = cy.$$(blog).text().match(regexpLikes);
              const likeCount = parseInt(match[1], 10);
              // cy.log(likeCount);
              return likeCount;
            })
              .get(); // get a plain array from jQuery object
            const likesInDescendingOrder = [...likes].sort((a, b) => b - a);
            expect(likes).to.be.deep.equal(likesInDescendingOrder);
          });
      });
    });
  });
  describe('When logged in as userB', function () {
    beforeEach(function () {
      cy.login(userA);
      userA.blogs.forEach((blog) => {
        cy.createBlog(blog);
      });
      // no need to logout since login's overwrite of localStorage is enough
      cy.login(userB);
    });
    it('userB cannot delete blog of userA', function () {
      cy.get('.blog.compactView')
        .contains(userA.blogs[0].title).within(() => {
          cy.get('button').contains(/view/i).click();
        });
      cy.get('.blog.detailedView')
        .contains(userA.blogs[0].title).within(() => {
          cy.get('button').contains((/delete/i)).should('not.exist');
        });
    });
  });
});
