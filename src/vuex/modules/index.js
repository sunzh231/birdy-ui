/*eslint-disable */
import {
  FETCH_INFO,
  FETCH_PLAYERS
} from '../mutation-types';

// 该模块的初始状态
const state = {
  config: {
    prizeScope: '',
    sel: '请选择奖品',
    prizeLists: [],
  },
  playerLists: []
};

// 相关的 mutations
const mutations = {
  [FETCH_INFO](state, data) {
    state.config.prizeLists = data.prizes;
    state.config.prizeScope = data.prizeScope;
  },
  [FETCH_PLAYERS](state, playerLists) {
    state.playerLists = playerLists;
    console.log(playerLists);
  },
};

export default {
  state,
  mutations
};
