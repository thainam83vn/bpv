import { PredictivePage } from './app.po';

describe('predictive App', function() {
  let page: PredictivePage;

  beforeEach(() => {
    page = new PredictivePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
