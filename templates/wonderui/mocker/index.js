const noMock = process.env.MOCK === 'none';

const proxy = {
  'GET /api/notices': (req, res) => {
    res.send({
      data: [
        {
          timestamp: (new Date()).getTime(),
          content: '通知内容1'
        },
        {
          timestamp: (new Date()).getTime()+1000,
          content: '通知内容2'
        },
        {
          timestamp: (new Date()).getTime()+2000,
          content: '通知内容3'
        }
      ],
      responseCode: '00',
      responseMessage: ''
    });
  }
}

module.exports = (noMock ? {} : proxy);
