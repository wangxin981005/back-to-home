window.map = (() => {
  const scale = 40;
  let currentLevel = 8;
  const levels = [
    // #1
    [[0,0,0,80,5],[0,0,5,21,5],[0,21,5,2,4],[0,23,5,4,3],[0,39,5,2,2],[0,41,5,2,4],[0,43,5,2,6],[0,45,5,35,6],[0,0,14,24,18],[0,24,15,1,17],[0,25,17,12,15],[0,37,15,1,17],[0,38,14,42,18],[6,4,10,1,1],[7,79,11,1,1]],
    // #2
    [[0,0,0,8,11],[0,8,0,13,4],[0,44,0,2,4],[0,46,0,2,7],[0,52,0,18,7],[0,0,14,28,16],[0,28,10,14,20],[0,42,13,28,17],[1,32,0,2,1],[0,21,0,11,1],[0,34,0,10,1],[7,69,7,1,1],[6,0,11,1,1]],
    // #3
    [[0,0,0,7,7],[0,7,0,14,1],[0,23,3,6,1],[0,31,0,10,1],[0,7,1,1,5],[0,8,1,1,4],[0,9,1,1,3],[0,10,1,1,2],[0,11,1,1,1],[0,55,0,4,1],[0,62,0,4,1],[0,69,0,21,1],[0,0,11,22,19],[0,22,19,68,11],[0,22,13,2,6],[0,24,15,2,4],[0,26,17,2,2],[4,41,0,1,1],[4,42,0,1,1],[4,43,0,1,1],[4,44,0,1,1],[4,45,0,1,1],[4,46,0,1,1],[4,47,0,1,1],[4,48,0,1,1],[4,49,0,1,1],[4,50,0,1,1],[4,51,0,1,1],[4,52,0,1,1],[4,53,0,1,1],[4,54,0,1,1],[1,69,7,4,5],[1,76,9,4,6],[1,83,8,6,1],[6,0,7,1,1],[7,89,1,1,1]],
    // #4
    [[0,0,0,10,1],[0,10,0,4,7],[0,14,0,9,9],[0,27,8,3,1],[4,33,8,3,1],[0,39,8,3,1],[4,45,8,3,1],[0,51,8,3,1],[1,23,0,37,1],[0,60,0,9,5],[0,79,0,11,1],[4,73,3,2,1],[0,31,16,15,2],[0,26,18,25,13],[0,60,12,9,19],[0,82,7,4,3],[7,89,1,1,1],[6,0,1,1,1]],
    // #5
    [[0,0,0,9,1],[0,11,0,1,10],[0,14,0,4,7],[0,33,5,1,14],[0,37,14,13,2],[1,76,0,6,1],[0,25,0,5,7],[0,55,11,5,1],[0,68,0,1,7],[0,69,0,1,5],[0,63,0,5,8],[0,70,0,1,3],[0,71,0,5,1],[0,82,0,8,1],[0,0,17,4,13],[0,4,15,12,15],[0,16,20,6,10],[0,22,23,21,11],[0,43,25,27,9],[0,25,13,5,1],[1,76,8,6,1],[6,0,1,1,1],[7,89,1,1,1]],
    // #6
    [[0,0,0,10,1],[0,11,2,3,1,7,7],[0,23,0,7,11],[0,49,0,15,1],[0,64,0,6,4],[0,32,9,4,1,9,-5],[1,30,0,19,1],[1,10,0,13,1],[0,23,16,7,16],[0,6,18,17,14],[0,30,20,15,12],[4,50,6,3,1],[4,56,8,3,1],[0,64,14,6,18],[0,62,20,2,12],[0,45,24,17,8],[7,69,4,1,1],[6,0,1,1,1]],
    // #7
    [[0,0,0,5,4],[0,35,2,4,1,-29,0],[0,40,0,6,4],[1,14,3,1,1],[1,20,3,1,1],[1,25,3,1,1],[1,31,3,1,1],[1,5,0,35,1],[1,14,9,1,7],[1,20,9,1,7],[1,25,9,1,7],[1,31,9,1,7],[0,56,0,14,1],[0,72,3,1,7],[0,76,5,1,8],[1,76,8,1,2],[0,80,6,1,10],[0,84,0,16,7],[0,84,11,16,19],[0,62,22,22,8],[0,58,9,10,13],[0,45,12,13,10],[0,0,22,62,8],[0,5,11,2,11],[0,2,13,3,9],[0,7,14,5,8],[2,48,3,6,1],[6,0,4,1,1],[7,99,7,1,1]],
    // #8
    [[0,0,0,10,3],[0,14,4,3,1,0,9],[0,22,6,1,12],[0,24,11,4,1,11,0],[0,37,21,29,1],[0,35,12,1,4,7,0],[0,44,0,22,21],[1,10,0,34,1],[0,33,14,1,17],[0,47,22,1,1],[0,48,22,1,2],[0,49,22,1,3],[0,52,22,1,3],[0,53,22,1,2],[0,54,22,1,1],[0,49,30,4,8],[0,53,31,5,7],[0,58,33,8,5],[0,39,32,10,6],[0,12,35,27,3],[1,50,21,2,1],[7,65,22,1,1],[6,0,3,1,1]],
    // #9
    [[0,12,9,3,1,8,-7],[0,24,1,1,8],[5,13,2,1,1,7,7],[0,26,2,3,1,9,7],[5,29,6,1,1,10,0],[1,10,0,40,1],[0,44,2,1,15],[0,0,0,10,8],[0,50,0,2,15],[0,68,0,2,15],[0,52,0,16,12],[1,52,12,16,1],[0,39,23,13,12],[0,15,25,24,10],[0,52,22,18,13],[0,54,14,2,1,11,0],[6,0,8,1,1],[7,69,15,1,1]],
  ];
  let backward = false;

  let mapData = {
    map: [],
    enemy: [],
    start: new V(),
    end: new V()
  };

  function initLevel() {
    mapData = {
      map: [],
      enemy: [],
      start: new V(),
      end: new V()
    };
    levels[currentLevel].forEach((item) => {
      if (item[0] === 4) {
        mapData.map.push(new BrokenBlock(item[0], item[1] * scale, item[2] * scale, item[3] * scale, item[4] * scale, (typeof item[5] !== 'undefined' ? new V(item[5], item[6]) : new V()).get().mult(scale)));
      } else if (item[0] === 5) {
        mapData.enemy.push(new SawBlock(item[0], item[1] * scale, item[2] * scale, item[3] * scale, item[4] * scale, (typeof item[5] !== 'undefined' ? new V(item[5], item[6]) : new V()).get().mult(scale)));
      } else if (item[0] === 6) {
        mapData.start = new V(item[1] * scale, item[2] * scale);
      } else if (item[0] === 7) {
        mapData.end = new V(item[1] * scale, item[2] * scale);
      } else {
        mapData.map.push(new Block(item[0], item[1] * scale, item[2] * scale, item[3] * scale, item[4] * scale, (typeof item[5] !== 'undefined' ? new V(item[5], item[6]) : new V()).get().mult(scale)));
      }
    });
  }

  return {
    i: () => {
      initLevel();
    },
    reset: () => {
      initLevel();
    },
    n: () => {
      mapData.map.forEach((item) => {
        item.n();
      });

      mapData.enemy.forEach((item) => {
        item.n();
      });
    },
    r: () => {
      mapData.map.forEach((item) => {
        item.r();
      });
      mapData.enemy.forEach((item) => {
        item.r();
      });
    },
    getMap: () => mapData,
    currentLevel: () => currentLevel,
    nextLevel: (direction) => {
      backward = direction === -1;
      currentLevel += direction;
    },
    getStart: () => mapData.start,
    getCharacterStart: () => (backward ? mapData.end : mapData.start),
    getEnd: () => mapData.end,
    isFirst: () => (currentLevel === 0),
    isLast: () => (currentLevel === levels.length - 1)
  };
})();
