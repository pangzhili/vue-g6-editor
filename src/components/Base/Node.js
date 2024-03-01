class Node extends Object {
    constructor(params) {
        super()
        this.id = params.id
        for (let key in params) {
            this[key] = params[key] || 0
        }
        this.size = params.size.split('*')
        // 所属组
        this.parent = params.parent
        // 渲染层级
        this.index = params.index
    }
}

export default Node;