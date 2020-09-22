const rooms = [];

const addRoom = (data) => {
  var date_time = new Date().toISOString();
  rooms.push({
    roomCode : data.roomCode,
    sender_seq : data.sender_seq,
    sender_name : data.sender_name,
    receiver_seq : data.receiver_seq,
    receiver_name : data.receiver_name,
    items_seq : data.items_seq,
    item_name : data.item_name,
    cmp_seq : data.cmp_seq,
    cmp_name : data.cmp_name,
    reg_date : date_time,
    messages : [],
  });
  console.log('Room? : ', rooms)
}

const getRoom = (roomList) => {
  var rawArray = new Array();
  roomList.map((data) => {
    for(var i = 0; i < rooms.length; i++) {
      if (data == rooms[i].roomCode) {
        rawArray.push(rooms[i]);
      }
    }
  })
  return rawArray;
}

module.exports = { addRoom, getRoom };