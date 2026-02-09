const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const collection = db.collection('sessions');

exports.main = async () => {
  try {
    const res = await collection.orderBy('updatedAt', 'desc').get();
    return { ok: true, list: res.data || [] };
  } catch (err) {
    console.error('listSessions error', err);
    return { ok: false, message: err.message || '云端异常' };
  }
};
