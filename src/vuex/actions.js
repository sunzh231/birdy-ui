import { ACTIVITY, ACTIVITY_PART, GET_TRAFFIC } from '../app.config';
import Vue from 'vue';

/**

 * @param  {[type]} dispatch [description]
 * @param  {[type]} id       [description]
 * @return {[type]}          [description]
 */
export const fetchInfo = ({ dispatch }, id) => {
  const params = {
    token: '3db43376-220f-49cb-ae11-9b54663cdc53',
    id
  };
  return new Promise((resolve, reject) => {
    Vue.http.get(ACTIVITY, params)
    .then(resp => {
      const data = resp.data.activity;
      resolve(data);
      return dispatch('FETCH_INFO', data);
    })
    .catch(err => {
      reject(err);
    });
  });
};

/**
 * 获取流量具体信息(昵称,头像)
 * @param  {int} id trafficId
 * @return {[type]}    [description]
 */
function getAllTraffic(id) {
  return new Promise((resolve, reject) => {
    Vue.http.get(GET_TRAFFIC, { id })
      .then(resp => {
        const data = resp.data.traffic;
        const name = data.nickname ? data.nickname : '游客';
        const avatar = data.avatar ? data.avatar : this.opts.normalPic;
        resolve({ name, avatar, id });
      })
      .catch(err => {
        reject(err);
      });
  });
}
/**
 * 推广会参与者列表查询
 * @param  {int} activityId 活动Id
 * @param  {int} prized     中奖情况默认999是全部奖项
 * @param  {int} type       默认2是签到人员列表,3是全体人员
 * @return {[object]}      promise
 */
export const fetchPlayers = ({ dispatch }, activityId, prized, type) => {
  const params = {
    activityId,
    prized,
    type
  };

  return new Promise((resolve, reject) => {
    Vue.http.get(ACTIVITY_PART, params)
      .then(resp => {
        const trafficList = [];
        const data = resp.data.participators;
        for (let i = 0; i < data.length; i++) {
          // trafficList.push(data[i].trafficId);
          const id = data[i].trafficId;
          getAllTraffic(id)
            .then(traffic => {
              trafficList.push(traffic);
              if (i === data.length - 1) {
                resolve(trafficList);
                dispatch('FETCH_PLAYERS', trafficList);
              }
            });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
