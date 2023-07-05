package com.asm63.unityspace.mappers;

import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;
import org.apache.ibatis.type.TypeHandler;
import org.springframework.stereotype.Component;

import java.sql.*;
import java.util.Arrays;
import java.util.List;


@Component
@MappedTypes(List.class)
@MappedJdbcTypes(JdbcType.ARRAY)
public class StringArrayListTypeHandler implements TypeHandler<List<String>> {
        @Override
        public void setParameter(PreparedStatement ps, int i, List<String> parameter, JdbcType jdbcType) throws SQLException {
                Array array = ps.getConnection().createArrayOf("varchar", parameter.toArray());
                ps.setArray(i, array);
        }

        @Override
        public List<String> getResult(ResultSet rs, String columnName) throws SQLException {
                return Arrays.asList((String[]) rs.getArray(columnName).getArray());
        }

        @Override
        public List<String> getResult(ResultSet rs, int columnIndex) throws SQLException {
                return Arrays.asList((String[]) rs.getArray(columnIndex).getArray());
        }

        @Override
        public List<String> getResult(CallableStatement cs, int columnIndex) throws SQLException {
                return Arrays.asList((String[]) cs.getArray(columnIndex).getArray());
        }
}
