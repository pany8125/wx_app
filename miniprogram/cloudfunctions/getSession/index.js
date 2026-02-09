const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const collection = db.collection('sessions');

exports.main = async (event) => {
  const { code } = event || {};
  if (!code) {
    return { ok: false, message: '缺少 code' };
  }

  try {
    const res = await collection.where({ code }).get();
    if (!res.data || !res.data.length) {
      return { ok: false, message: '未找到场次' };
    }
    const doc = res.data[0];
    return {
      ok: true,
      session: {
        code: doc.code,
        name: doc.name,
        start: doc.start,
        end: doc.end,
        version: doc.version,
        updatedAt: doc.updatedAt || doc.createdAt
      },
      questions: doc.questions || []
    };
  } catch (err) {
    console.error('getSession error', err);
    return { ok: false, message: err.message || '云端异常' };
  }
};
