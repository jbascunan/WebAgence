'use strict'

var conn = require('./agence-connection'),
    AgenceModel = () => {}

AgenceModel.getAll = (cb) => {
    conn.query(`SELECT u.co_usuario,u.no_usuario FROM caol.cao_usuario u
            INNER JOIN caol.permissao_sistema p ON p.co_usuario = u.co_usuario 
            WHERE p.CO_SISTEMA = 1 AND p.IN_ATIVO = 'S'
            AND p.CO_TIPO_USUARIO IN(0, 1, 2)`, cb)
}

AgenceModel.getRelatorio = (data, cb) => {
    let sql = `SELECT 
        c.co_usuario,
        SUM(f.valor - ((f.valor * f.total_imp_inc) / 100)) AS liquido,
        s.brut_salario AS CostoFijo,
        SUM(((f.valor - ((f.valor * f.total_imp_inc) / 100)) * f.COMISSAO_CN)/100) AS comision,
        (SUM((f.valor - ((f.valor * f.total_imp_inc) / 100))) - (s.brut_salario) - (((f.valor - ((f.valor * f.total_imp_inc) / 100)) * f.COMISSAO_CN)/100)) as lucro,
        YEAR(f.data_emissao) anio,
		Date_format(f.data_emissao,'%M') mes
        FROM caol.cao_fatura f
        INNER JOIN caol.cao_os c ON f.co_os = c.co_os
        LEFT JOIN caol.cao_salario s ON s.co_usuario = c.co_usuario
        WHERE c.co_usuario = '${data.co_usuario}'
        AND (YEAR(f.data_emissao) BETWEEN ${data.anioInicio} AND ${data.anioFin}) 
        AND (MONTH(f.data_emissao) BETWEEN ${data.mesInicio} AND ${data.mesFin})
        GROUP BY co_usuario, Date_format(f.data_emissao,'%Y-%m');`

    conn.query(sql, cb)
}

AgenceModel.getDatosPizza = (data, cb) => {
    let sql = `SELECT         
        u.no_usuario as name,
        (SUM(f.valor - ((f.valor * f.total_imp_inc) / 100)) - (((f.valor - ((f.valor * f.total_imp_inc) / 100)) * f.COMISSAO_CN)/100)) as y
        FROM caol.cao_fatura f
        INNER JOIN caol.cao_os c ON f.co_os = c.co_os
        LEFT JOIN caol.cao_salario s ON s.co_usuario = c.co_usuario
        INNER JOIN caol.cao_usuario u ON u.co_usuario = c.co_usuario
        WHERE c.co_usuario IN(${data.co_usuario})
        AND (YEAR(f.data_emissao) BETWEEN ${data.anioInicio} AND ${data.anioFin}) 
        AND (MONTH(f.data_emissao) BETWEEN ${data.mesInicio} AND ${data.mesFin})
        GROUP BY no_usuario;
        `
    conn.query(sql, cb)
}
AgenceModel.getDatosBarra = (data, cb) => {
    let sql = `SELECT 
        c.co_usuario,
        u.no_usuario as name,
        YEAR(f.data_emissao) anio,
        MONTH(f.data_emissao) mes,
        (SUM(f.valor - ((f.valor * f.total_imp_inc) / 100)) - (((f.valor - ((f.valor * f.total_imp_inc) / 100)) * f.COMISSAO_CN)/100)) as y
        FROM caol.cao_fatura f
        INNER JOIN caol.cao_os c ON f.co_os = c.co_os
        LEFT JOIN caol.cao_salario s ON s.co_usuario = c.co_usuario
        RIGHT JOIN caol.cao_usuario u ON u.co_usuario = c.co_usuario
        WHERE u.co_usuario = '${data.co_usuario}'
        AND YEAR(f.data_emissao) = ${data.anioFin} 
        AND (MONTH(f.data_emissao) BETWEEN ${data.mesInicio} AND ${data.mesFin})
        GROUP BY no_usuario, Date_format(f.data_emissao,'%Y-%m');        `
    conn.query(sql, cb)
}


module.exports = AgenceModel