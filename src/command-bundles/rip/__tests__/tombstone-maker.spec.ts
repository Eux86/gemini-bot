import { tombstoneMaker } from '../tombstone-maker';

// eslint-disable-next-line
const emptySpace = "‏‏‎ ‎";
describe('Tombstone', () => {
  describe('Tombstone maker', () => {
    it('should return a well spaced tombstone when a single word is the epitaph', () => {
      const expected = `${emptySpace}
                .
               -|-
                |
           .-'~~~~~~'-.
         .'            '.
         |  typescript  |
         |              |
         |              |
       ^^^^^^^^^^^^^^^^^^^^
      `.trim();
      const tombstone = tombstoneMaker('typescript');
      expect(tombstone).toEqual(expected);
    });
    it('should return a well spaced tombstone when a short word is the epitaph', () => {
      const expected = `${emptySpace}
              .
             -|-
              |
           .-'~'-.
         .'       '.
         |  js     |
         |         |
         |         |
       ^^^^^^^^^^^^^^^
      `.trim();
      const tombstone = tombstoneMaker('js');
      expect(tombstone).toEqual(expected);
    });
    it('should return a well spaced tombstone when a long phrase is the epitaph', () => {
      const expected = `${emptySpace}
                        .
                       -|-
                        |
           .-'~~~~~~~~~~~~~~~~~~~~~~'-.
         .'                            '.
         |  this is a very long phrase  |
         |                              |
         |                              |
       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      `.trim();
      const tombstone = tombstoneMaker('this is a very long phrase');
      expect(tombstone).toEqual(expected);
    });
    it('should return a multiline tombstone when a very very long phrase is the epitaph', () => {
      const expected = `${emptySpace}
                        .
                       -|-
                        |
           .-'~~~~~~~~~~~~~~~~~~~~~~'-.
         .'                            '.
         |  this is a very long phrase  |
         |   with more then 26 charact  |
         |  ers                         |
         |                              |
         |                              |
       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      `.trim();
      const tombstone = tombstoneMaker('this is a very long phrase with more then 26 characters');
      expect(tombstone).toStrictEqual(expected);
    });
  });
});
