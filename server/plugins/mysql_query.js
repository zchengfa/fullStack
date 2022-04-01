
const mysql_query = {
    selectAll(table_name, confident='') {
        if (confident === '') {
            return `SELECT * FROM ${table_name}`
        }
        else {
            return `SELECT * FROM ${table_name} WHERE ${confident}`
        }
    },
    selectCount(table_name, confident='') {
        if (confident === '') {
            return `SELECT COUNT(1) FROM ${table_name}`
        }
        else {
            return `SELECT COUNT(1) FROM ${table_name} WHERE ${confident}`
        }
    },
    selectFields(table_name, fields, confident=''){
        if (confident === '') {
            return `SELECT ${fields} FROM ${table_name}`
        }
        else {
            return `SELECT ${fields} FROM ${table_name} WHERE ${confident}`
        }
    },
    selectAllWithLimit(table_name,number,confident){
        if (!confident){
            return `SELECT * FROM ${table_name} LIMIT ${number}`
        }
        else {
            return `SELECT * FROM ${table_name} WHERE ${confident} LIMIT ${number}`
        }
    },
    selectAllOrderByFields(table_name,confident,orderByFields,descOrAsc){
        if (!confident){
            return `SELECT * FROM ${table_name} ORDER BY ${orderByFields} ${descOrAsc}`
        }
        else{
            return `SELECT * FROM ${table_name} WHERE ${confident}  ORDER BY ${orderByFields} ${descOrAsc}`
        }
    },
    selectFieldsOrderByFields(table_name,fields,confident,orderByFields,descOrAsc){
        if (!confident){
            return `SELECT ${fields} FROM ${table_name} ORDER BY ${orderByFields} ${descOrAsc}`
        }
        else{
            return `SELECT ${fields} FROM ${table_name} WHERE ${confident}  ORDER BY ${orderByFields} ${descOrAsc}`
        }
    },
    selectAllByLike(table_name,fields,keyword){
        return `SELECT * FROM ${table_name} WHERE CONCAT(${fields}) Like ${keyword}`
    },
    insert(table_name,fields,values){
        return `INSERT INTO ${table_name} (${fields}) VALUES (${values})`
    },
    update(table_name,values,confident) {
        return `UPDATE ${table_name} SET ${values} WHERE ${confident}`
    },
    deleteOperation(table_name,confident){
        return `DELETE FROM ${table_name} WHERE ${confident}`
    }
}

module.exports = mysql_query