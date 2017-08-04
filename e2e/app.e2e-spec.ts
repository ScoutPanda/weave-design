import { WeavingTestPage } from './app.po';

describe('weaving-test App', () => {
  let page: WeavingTestPage;

  beforeEach(() => {
    page = new WeavingTestPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
