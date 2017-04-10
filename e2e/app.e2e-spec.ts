import { WeavingAppPage } from './app.po';

describe('weaving-app App', () => {
  let page: WeavingAppPage;

  beforeEach(() => {
    page = new WeavingAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
