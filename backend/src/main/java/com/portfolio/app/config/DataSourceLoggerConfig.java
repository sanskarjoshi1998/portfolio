package com.portfolio.app.config;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSourceLoggerConfig implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof DataSourceProperties) {
            DataSourceProperties props = (DataSourceProperties) bean;
            System.out.println("====== [PRE-CONNECTION LOG] ======");
            System.out.println("SQL Server Target JDBC URL: " + props.getUrl());
            System.out.println("Database Username: " + props.getUsername());
            System.out.println("==================================");
        }
        return bean;
    }
}
