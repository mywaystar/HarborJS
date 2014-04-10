var exec     = require('ssh-exec');

//socket functions
module.exports = function(io, credentials){

io.sockets.on('connection', function(socket){
  socket.on('sshkey', function(data){
    exec('touch ssh.pub ; echo '+data.mysshkey+' > ssh.pub; cat ~/ssh.pub | sudo sshcommand acl-add dokku '+ data.name, credentials).pipe(process.stdout);
  });

  socket.on('containerId', function(data){
    exec('docker kill '+ data.idcont +'; sudo rm -r /home/dokku/'+ data.namecont, credentials).pipe(process.stdout);
  });

  socket.on('dbCreate',function(data){
    var name=data.name;
    var type=data.type;
    console.log(type +' ' + name);
    exec('dokku '+type+':create '+name, credentials).pipe(process.stdout);
  });

  socket.on('cmd', function(data){
    var cmd=data.cmd;
    var name=data.name;
    exec('dokku run ' + name + ' ' + cmd, credentials).pipe(process.stdout);
  });

  socket.on('dbLink', function(data){
    var app=data.appName;
    var db=data.dbName;
    exec('dokku postgresql:link '+ app +' '+ db +'; dokku mysql:link '+ app +' '+ db +'; dokku redis:link '+ app +' '+ db, credentials).pipe(process.stdout);
  });
});

};
