export default function clientEvents(io, socket) {
  socket.on('join:clients', () => {
    socket.join('clients');
    console.log(`Cliente ${socket.id} se unió a la sala "clients"`);
  });

  socket.on('client:order', async (data, cb) => {
    // const result = await loginUser(data)
    console.log(data)
    cb(result)
  })

  socket.on('client:order/update', async (data, cb) => {
    // const result = await updateProfile(data)
    cb(result)
  })
}
