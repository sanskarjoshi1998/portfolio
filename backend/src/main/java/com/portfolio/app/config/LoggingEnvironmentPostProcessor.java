package com.portfolio.app.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertySource;

public class LoggingEnvironmentPostProcessor implements EnvironmentPostProcessor {
    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        for (PropertySource<?> propertySource : environment.getPropertySources()) {
            if (propertySource.getSource() instanceof java.util.Map) {
            	System.out.println("------------------------------------------------------------------------");
                ((java.util.Map<?, ?>) propertySource.getSource())
                        .forEach((key, value) -> System.out.println(key + " = " + value));
            }
            System.out.println("------------------------------------------------------------------------");
        }
    }
}
