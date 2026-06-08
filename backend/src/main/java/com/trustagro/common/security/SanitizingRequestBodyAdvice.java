package com.trustagro.common.security;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.time.temporal.Temporal;
import java.util.Collection;
import java.util.IdentityHashMap;
import java.util.Map;

@ControllerAdvice
public class SanitizingRequestBodyAdvice extends RequestBodyAdviceAdapter {

    @Override
    public boolean supports(MethodParameter methodParameter, java.lang.reflect.Type targetType,
                            Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object afterBodyRead(Object body, HttpInputMessage inputMessage, MethodParameter parameter,
                                java.lang.reflect.Type targetType,
                                Class<? extends HttpMessageConverter<?>> converterType) {
        sanitizeObject(body, new IdentityHashMap<>());
        return body;
    }

    @Override
    public Object handleEmptyBody(Object body, HttpInputMessage inputMessage, MethodParameter parameter,
                                  java.lang.reflect.Type targetType,
                                  Class<? extends HttpMessageConverter<?>> converterType) {
        return body;
    }

    @Override
    public HttpInputMessage beforeBodyRead(HttpInputMessage inputMessage, MethodParameter parameter,
                                           java.lang.reflect.Type targetType,
                                           Class<? extends HttpMessageConverter<?>> converterType) {
        return inputMessage;
    }

    private void sanitizeObject(Object value, IdentityHashMap<Object, Boolean> visited) {
        if (value == null || visited.containsKey(value) || isSimpleType(value.getClass())) {
            return;
        }

        visited.put(value, Boolean.TRUE);

        if (value instanceof Collection<?> collection) {
            collection.forEach(item -> sanitizeObject(item, visited));
            return;
        }

        if (value instanceof Map<?, ?> map) {
            map.forEach((key, mapValue) -> {
                sanitizeObject(key, visited);
                sanitizeObject(mapValue, visited);
            });
            return;
        }

        Class<?> current = value.getClass();
        while (current != null && current != Object.class) {
            for (Field field : current.getDeclaredFields()) {
                if (Modifier.isStatic(field.getModifiers()) || Modifier.isFinal(field.getModifiers())) {
                    continue;
                }

                field.setAccessible(true);
                try {
                    Object fieldValue = field.get(value);
                    if (fieldValue instanceof String stringValue) {
                        field.set(value, StringSanitizer.sanitize(stringValue));
                    } else {
                        sanitizeObject(fieldValue, visited);
                    }
                } catch (IllegalAccessException ignored) {
                }
            }
            current = current.getSuperclass();
        }
    }

    private boolean isSimpleType(Class<?> clazz) {
        return clazz.isPrimitive()
                || clazz.isEnum()
                || Number.class.isAssignableFrom(clazz)
                || Boolean.class == clazz
                || Character.class == clazz
                || CharSequence.class.isAssignableFrom(clazz)
                || Temporal.class.isAssignableFrom(clazz)
                || clazz.getPackageName().startsWith("java.");
    }
}
