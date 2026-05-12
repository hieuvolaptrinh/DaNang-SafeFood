package com.danang.safefood.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class TrangThaiViPhamConverter implements AttributeConverter<TrangThaiViPham, String> {

    @Override
    public String convertToDatabaseColumn(TrangThaiViPham attribute) {
        return attribute != null ? attribute.getLabel() : null;
    }

    @Override
    public TrangThaiViPham convertToEntityAttribute(String dbData) {
        return TrangThaiViPham.fromValue(dbData);
    }
}
