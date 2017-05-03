import { LizardNgPage } from './app.po';

describe('lizard-ng App', function() {
  let page: LizardNgPage;

  beforeEach(() => {
    page = new LizardNgPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
