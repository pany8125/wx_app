export function getMockQuestions() {
  return [
    {
      id: 'q1',
      title: '本次培训主题是否清晰？',
      type: 'single',
      typeLabel: '单选',
      options: [
        { label: '非常清晰', value: 'a' },
        { label: '比较清晰', value: 'b' },
        { label: '一般', value: 'c' },
        { label: '不清晰', value: 'd' }
      ],
      value: ''
    },
    {
      id: 'q2',
      title: '你认为需要改进的环节（可多选）',
      type: 'multi',
      typeLabel: '多选',
      options: [
        { label: '案例数量', value: 'a' },
        { label: '实操时间', value: 'b' },
        { label: '互动环节', value: 'c' },
        { label: '讲解深度', value: 'd' }
      ],
      value: []
    },
    {
      id: 'q3',
      title: '请给培训整体打分（1-5）',
      type: 'score',
      typeLabel: '评分',
      value: 0
    },
    {
      id: 'q4',
      title: '请补充你的建议',
      type: 'text',
      typeLabel: '主观题',
      value: ''
    }
  ];
}

export function getMockReport() {
  return {
    overallScore: 86,
    summary: '学员整体掌握良好，实操与案例仍有提升空间。',
    questions: [
      { id: 'q1', title: '培训主题是否清晰', accuracy: 92 },
      { id: 'q2', title: '需要改进的环节', accuracy: 74 },
      { id: 'q3', title: '整体打分', accuracy: 88 }
    ]
  };
}
