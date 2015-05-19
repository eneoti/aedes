var test = require('tape').test
var helper = require('./helper')
var setup = helper.setup
var connect = helper.connect

test('publish QoS 2', function (t) {
  var s = connect(setup())

  s.inStream.write({
    cmd: 'publish',
    topic: 'hello',
    payload: 'world',
    qos: 2,
    messageId: 42
  })

  s.outStream.once('data', function (packet) {
    t.deepEqual(packet, {
      cmd: 'pubrec',
      messageId: 42,
      length: 2,
      dup: false,
      retain: false,
      qos: 0
    }, 'pubrec must match')

    s.inStream.write({
      cmd: 'pubrel',
      messageId: 42
    })

    s.outStream.once('data', function (packet) {
      t.deepEqual(packet, {
        cmd: 'pubcomp',
        messageId: 42,
        length: 2,
        dup: false,
        retain: false,
        qos: 2
      }, 'pubcomp must match')

      t.end()
    })
  })
})