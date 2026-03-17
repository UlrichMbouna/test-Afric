export interface RegisterRequest {
  name:  string;
  email:      string;
  password:   string;
}
export interface RegisterResponse {
  status:   string;
  message?: string;
  data?:    any;
}
export interface LoginRequest {
  email:    string;
  password: string;
}

export interface LoginResponse {
  status:   string;
  message?: string;
  data?:    any;
}
