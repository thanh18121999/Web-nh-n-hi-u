var HOST = "https://brandname.phuckhangnet.vn/api";
//var HOST = "https://localhost:5001";
var LOCAL = process.env.LOCAL;

var token = "";

// USER
export const UserLogin = async (username, password) => {
  let dataJson = JSON.stringify({
    Username: username,
    Password: password,
  });

  let res = await fetch(`${HOST}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "LOGIN_SUCCESSFUL") {
    return res;
  } else {
    return res.message;
  }
};

export const getToken = () => {
  if (!token) {
    return sessionStorage.getItem("token");
  }
};

export const AddUser = async (
  username,
  password,
  role,
  avatar,
  name,
  phone,
  email,
  aboutme,
  // position,
  // title,
  // department,
  // education,
  // office,
  // major,
  // language,
  // research,
  // supervision,
  // publication,
  // teachingcourse,
  onCancel = () => {}
) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Username: username,
    Password: password,
    Role: role,
    Avatar: avatar,
    Name: name,
    Phone: phone,
    Email: email,
    Aboutme: aboutme,
    // Position: position,
    // Title: title,
    // Department: department,
    // Education: education,
    // Office: office,
    // Major: major,
    // Language: language,
    // Research: research,
    // Supervision: supervision,
    // Publication: publication,
    // TeachingCourse: teachingcourse,
  });
  let res = await fetch(`${HOST}/user/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "ADD_SUCCESSFUL") {
    onCancel();
    return res;
  } else {
    return res.message;
  }
};

export const UpdateUser = async (
  id,
  role,
  avatar,
  name,
  phone,
  email,
  aboutme,
  // position,
  // title,
  // department,
  // education,
  // office,
  // major,
  // language,
  // research,
  // supervision,
  // publication,
  // teachingcourse,
  onCancel = () => {}
) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    ID: id,
    Role: role,
    Avatar: avatar,
    Name: name,
    Phone: phone,
    Email: email,
    Aboutme: aboutme,
    // Position: position,
    // Title: title,
    // Department: department,
    // Education: education,
    // Office: office,
    // Major: major,
    // Language: language,
    // Research: research,
    // Supervision: supervision,
    // Publication: publication,
    // TeachingCourse: teachingcourse,
  });
  let res = await fetch(`${HOST}/user/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "UPDATE_SUCCESSFUL") {
    onCancel();
    return res;
  } else {
    return null;
  }
};

export const UserUpdateStatus = async (id) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    ID: id,
  });

  let res = await fetch(`${HOST}/user/update-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "UPDATE_SUCCESSFUL") {
    return res;
  } else {
    return null;
  }
};

export const UserChangePassword = async (
  username,
  oldpassword,
  newpassword,
  onCancel = () => {}
) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Username: username,
    OldPassword: oldpassword,
    NewPassword: newpassword,
  });

  let res = await fetch(`${HOST}/user/change_password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "CHANGE_PASSWORD_SUCCESSFUL") {
    onCancel();
    return res;
  } else {
    return null;
  }
};

export const UserResetPassword = async (username) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Username: username,
  });

  let res = await fetch(`${HOST}/user/reset_password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "RESET_PASSWORD_SUCCESSFUL") {
    return res;
  } else {
    return null;
  }
};

export const getStaffList = async () => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Type: "GET_ALL",
    Data: [],
  });

  let res = await fetch(`${HOST}/user/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "GET_SUCCESSFUL") {
    return res;
  } else {
    return null;
  }
};

// ROLE
export const getRoleList = async () => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Type: "",
    Data: [],
  });

  let res = await fetch(`${HOST}/role/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "GET_SUCCESSFUL") {
    return res;
  } else {
    return null;
  }
};

// ARTICLE
export const GetArticle = async (menuspage, userRole) => {
  let token = getToken();
  let dataJson = JSON.stringify({});
  if (userRole?.startsWith("LE")) {
    dataJson = JSON.stringify({
      Type: "GET_ALL_FROM_USER",
      Data: [],
      NoOfResult: 0,
      MenuID: menuspage,
      CurrentRole: userRole,
    });
  } else {
    dataJson = JSON.stringify({
      Type: "GET_ALL",
      Data: [],
      NoOfResult: 0,
      MenuID: menuspage,
      CurrentRole: userRole,
    });
  }

  let res = await fetch(`${HOST}/article/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "GET_SUCCESSFUL") {
    return res;
  } else {
    return null;
  }
};

export const AddArticle = async (
  avatar,
  title,
  summary,
  hastag,
  menu,
  language,
  article_content,
  onCancel = () => {}
) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Avatar: avatar,
    Title: title,
    Summary: summary,
    Hastag: hastag,
    Menu: menu,
    Language: language,
    ArticleContent: article_content,
  });
  let res = await fetch(`${HOST}/article/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "ADD_SUCCESSFUL") {
    onCancel();
    return res;
  } else {
    return null;
  }
};

export const UpdateArticle = async (
  id,
  title,
  articlecontent,
  hastag,
  menu,
  avatar,
  language,
  summary,
  onCancel = () => {}
) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    ID: id,
    Title: title,
    Article_Content: articlecontent,
    Hastag: hastag,
    Menu: menu,
    Avatar: avatar,
    Language: language,
    Summary: summary,
  });
  let res = await fetch(`${HOST}/article/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "UPDATE_SUCCESSFUL") {
    onCancel();
    return res;
  } else {
    return null;
  }
};

export const DeleteArticle = async (id) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    ID: id,
  });
  let res = await fetch(`${HOST}/article/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "DELETE_SUCCESSFUL") {
    return res.message;
  } else {
    return res.message;
  }
};

//BLOG
export const GetBlog = async () => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Type: "GET_ALL",
    Data: [],
    NoOfResult: 0,
  });
  let res = await fetch(`${HOST}/Blog/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "GET_SUCCESSFUL") {
    return res;
  } else {
    return null;
  }
};

export const AddBlog = async (
  title,
  article_content,
  hastag,
  language,
  onCancel = () => {}
) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Title: title,
    ArticleContent: article_content,
    Hastag: hastag,
    Language: language,
  });
  let res = await fetch(`${HOST}/Blog/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "ADD_SUCCESSFUL") {
    onCancel();
    return res;
  } else {
    return null;
  }
};

export const UpdateBlog = async (
  id,
  title,
  articlecontent,
  hastag,
  language,
  onCancel = () => {}
) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    ID: id,
    Title: title,
    Article_Content: articlecontent,
    Hastag: hastag,
    Language: language,
  });
  let res = await fetch(`${HOST}/Blog/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "UPDATE_SUCCESSFUL") {
    onCancel();
    return res;
  } else {
    return null;
  }
};

export const DeleteBlog = async (id) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    ID: id,
  });
  let res = await fetch(`${HOST}/Blog/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "DELETE_SUCCESSFUL") {
    return res.message;
  } else {
    return res.message;
  }
};

// UPLOAD
export const UploadFile = async (formData) => {
  let res = await fetch(`${HOST}/upload/verify_upload`, {
    method: "POST",
    body: formData,
  });
  res = await res.json();
  if (res) {
    return res;
  } else {
    return null;
  }
};

//WAREHOUSE
export const GetWarehouseFile = async () => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Type: "GET_ALL",
    Data: [],
  });
  let res = await fetch(`${HOST}/warehousefile/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "GET_SUCCESSFUL") {
    return res;
  } else {
    return null;
  }
};

export const getPositionList = async () => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Type: "GET_ALL",
    Data: [],
  });
  let res = await fetch(`${HOST}/list/position`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "GET_SUCCESSFUL") {
    return res;
  } else {
    return null;
  }
};

export const getTitleList = async () => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Type: "GET_ALL",
    Data: [],
  });
  let res = await fetch(`${HOST}/list/title`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "GET_SUCCESSFUL") {
    return res;
  } else {
    return null;
  }
};

export const getDepartmentList = async () => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Type: "GET_ALL",
    Data: [],
  });
  let res = await fetch(`${HOST}/list/department`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "GET_SUCCESSFUL") {
    return res;
  } else {
    return null;
  }
};

//MENU
export const getMenuList = async () => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Type: "GET_ALL",
    Data: [],
  });

  let res = await fetch(`${HOST}/menu/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "GET_SUCCESSFUL") {
    return res;
  } else {
    return null;
  }
};

export const getMenuListByRole = async (role) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Type: "GET_BY_ROLE",
    Data: [],
    Role: role,
  });

  let res = await fetch(`${HOST}/menu/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "GET_SUCCESSFUL") {
    return res;
  } else {
    return null;
  }
};

export const AddMenu = async (name, type, parent, onCancel = () => {}) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Name: name,
    Type: type,
    Parent: parent,
  });
  let res = await fetch(`${HOST}/menu/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "ADD_SUCCESSFUL") {
    onCancel();
    return res;
  } else {
    return null;
  }
};

export const getQAList = async () => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Type: "GET_ALL",
    Data: [],
  });

  let res = await fetch(`${HOST}/qa/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "GET_SUCCUSSFULLY") {
    return res;
  } else {
    return null;
  }
};

export const getQASampleList = async () => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Type: "GET_SAMPLE",
    Data: [],
  });

  let res = await fetch(`${HOST}/qa/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "GET_SUCCUSSFULLY") {
    return res;
  } else {
    return null;
  }
};

export const CreateQASample = async (question, answer, onCancel = () => {}) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Question: question,
    Answer: answer,
  });
  let res = await fetch(`${HOST}/qa/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "ADD SUCCESSFULLY") {
    onCancel();
    return res;
  } else {
    return null;
  }
};

export const answerQA = async (
  question,
  answer,
  answeruseremail,
  onCancel = () => {}
) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    ID: question,
    ANSWER: answer,
    ANSWERUSEREMAIL: answeruseremail,
  });
  let res = await fetch(`${HOST}/qa/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "ADD_SUCCESSFUL") {
    onCancel();
    return res;
  } else {
    return null;
  }
};

export const getBooking = async (role) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    Type: "GET_ALL",
    Data: [],
  });
  let res = await fetch(`${HOST}/booking/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "GET_SUCCESSFUL") {
    return res;
  } else {
    return null;
  }
};

export const cancelBooking = async (id) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    ID: id,
  });
  let res = await fetch(`${HOST}/booking/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200 && res.message == "DELETE SUCCESSFULLY") {
    return res;
  } else {
    return null;
  }
};

export const doneBooking = async (id) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    iDs: [id],
  });
  let res = await fetch(`${HOST}/booking/done`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200) {
    return res;
  } else {
    return null;
  }
};

export const UpdateBooking = async (
  idupdate,
  datetime,
  duration,
  updatenote,
  onCancel = () => {}
) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    id: idupdate,
    datetimebooked: datetime,
    duration: duration,
    updatenote: updatenote,
  });
  let res = await fetch(`${HOST}/booking/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200) {
    onCancel();
    return res;
  } else {
    return null;
  }
};

export const SendEmail = async (toemail, subjectemail, bodyemail) => {
  let token = getToken();
  let dataJson = JSON.stringify({
    toEmail: toemail,
    subjectEmail: subjectemail,
    bodyEmail: bodyemail,
  });
  let res = await fetch(`${HOST}/email/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: dataJson,
  });
  res = await res.json();
  if (res.statuscode == 200) {
    return res;
  } else {
    return null;
  }
};
