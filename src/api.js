export class API {
  constructor({ user, password }) {
    this.wpAuthorization = `Basic ${btoa(user + ":" + password)}`;
  }

  async getUserId(login) {
    const url = `https://hva.org.ua/wp-json/wp/v2/users?search=${login}`;
    const resp = await fetch(url, {
      headers: {
        Authorization: this.wpAuthorization,
      },
    });
    const users = await resp.json();
    return users[0].id;
  }

  async addToCourse(courseId, userId) {
    const url = `https://hva.org.ua/wp-json/ldlms/v2/sfwd-courses/${courseId}/users`;
    const data = { user_ids: [+userId] };
    const resp = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.wpAuthorization,
      },
      body: JSON.stringify(data),
    });
    return resp.json();
  }

  async createUser(user) {
    const url = "https://hva.org.ua/wp-json/wp/v2/users";
    const data = {
      username: user.login,
      name: user.surname + " " + user.name,
      first_name: user.name,
      last_name: user.surname,
      email: user.email,
      nickname: user.login,
      password: user.password,
    };

    return fetch(url, {
      method: "POST",
      headers: {
        Authorization: this.wpAuthorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
}
