class UserInfo {
  constructor(avatar, username, email, number) {
    this.avatar = avatar;
    this.username = username;
    this.email = email;
    this.number = number;
  }
}

const User = new UserInfo("", "JaneDoe", "jane.doe@example.com", "12345678");

export default User;
