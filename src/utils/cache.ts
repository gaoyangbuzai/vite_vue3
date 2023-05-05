const sessionCache = {
  set(key: string, value: any) {
    if (key != null && value != null) {
      sessionStorage.setItem(key, value)
    }
  },
  get(key: string) {
    if (key == null) {
      return null
    }
    return sessionStorage.getItem(key)
  },
  setJSON(key: string, jsonValue: any) {
    if (jsonValue != null) {
      this.set(key, JSON.stringify(jsonValue))
    }
  },
  getJSON(key: string) {
    const value = this.get(key)
    if (value != null) {
      return JSON.parse(value)
    }
  },
  remove(key: string) {
    sessionStorage.removeItem(key)
  }
}
const localCache = {
  set(key: string, value: any) {
    if (key != null && value != null) {
      localStorage.setItem(key, value)
    }
  },
  get(key: string) {
    if (key == null) {
      return null
    }
    return localStorage.getItem(key)
  },
  setJSON(key: string, jsonValue: any) {
    if (jsonValue != null) {
      this.set(key, JSON.stringify(jsonValue))
    }
  },
  getJSON(key: string) {
    const value = this.get(key)
    if (value != null) {
      return JSON.parse(value)
    }
  },
  remove(key: string) {
    localStorage.removeItem(key)
  }
}

export default {
  /**
   * 会话级缓存
   */
  session: sessionCache,
  /**
   * 本地缓存
   */
  local: localCache
}
