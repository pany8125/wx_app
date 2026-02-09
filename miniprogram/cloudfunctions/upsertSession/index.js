const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const collection = db.collection('sessions');

exports.main = async (event) => {
  const { session = {}, questions = [], adminSecret } = event || {};
  const { code } = session;

  if (!code) {
    return { ok: false, message: '缺少场次 code' };
  }

  const envSecret = process.env.ADMIN_SECRET;
  if (envSecret && adminSecret !== envSecret) {
    return { ok: false, message: '口令校验失败' };
  }

  const now = Date.now();
  const baseData = { ...session, questions, updatedAt: now };

  try {
    const exist = await collection.where({ code }).get();
    if (exist.data && exist.data.length) {
      const doc = exist.data[0];
      const version = (doc.version || 0) + 1;
      await collection.doc(doc._id).update({
        data: { ...baseData, version }
      });
      return { ok: true, code, version, updatedAt: now, from: 'update' };
    }

    await collection.add({
      data: { ...baseData, version: 1, createdAt: now }
    });
    return { ok: true, code, version: 1, createdAt: now, from: 'create' };
  } catch (err) {
    console.error('upsertSession error', err);
    return { ok: false, message: err.message || '云端异常' };
  }
};
