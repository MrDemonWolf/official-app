import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { PORTFOLIO_PROJECTS } from '../constants';

export function PortfolioScreen() {
  const projects = PORTFOLIO_PROJECTS;

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="px-6 py-6 pt-12">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 dark:text-white">Portfolio</Text>
          <Text className="mt-2 text-base text-gray-600 dark:text-gray-300">
            Showcase of my recent projects and achievements
          </Text>
        </View>

        {/* Featured Section */}
        <View className="mb-8 rounded-2xl bg-blue-50 p-6 dark:bg-blue-950/30">
          <Text className="text-lg font-bold text-blue-900 dark:text-blue-100">
            ✨ Featured Work
          </Text>
          <Text className="mt-3 text-sm leading-5 text-blue-800 dark:text-blue-200">
            A collection of my best projects demonstrating expertise in mobile development, backend
            integration, and user experience design.
          </Text>
        </View>

        {/* Projects Grid */}
        {projects.map((project) => (
          <View
            key={project.id}
            className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800">
            {/* Project Header with Icon */}
            <View className="border-b border-gray-100 bg-blue-500 px-6 py-5 dark:border-gray-700">
              <View className="flex-row items-center">
                <Text className="text-3xl">{project.icon}</Text>
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-bold text-white">{project.title}</Text>
                </View>
              </View>
            </View>

            {/* Project Content */}
            <View className="p-6">
              <Text className="text-sm leading-5 text-gray-700 dark:text-gray-300">
                {project.description}
              </Text>

              {/* Technologies */}
              <View className="mt-5 flex-row flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <View key={index} className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-700">
                    <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {tech}
                    </Text>
                  </View>
                ))}
              </View>

              {/* View Project Button */}
              <TouchableOpacity
                className="mt-5 rounded-lg bg-blue-600 py-2.5 active:bg-blue-700"
                activeOpacity={0.8}>
                <Text className="text-center font-semibold text-white">View Project →</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Footer Stats */}
        <View className="mt-8 mb-24 rounded-2xl bg-gray-100 p-6 dark:bg-gray-800">
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">3+</Text>
              <Text className="text-xs text-gray-600 dark:text-gray-400">Projects</Text>
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">100%</Text>
              <Text className="text-xs text-gray-600 dark:text-gray-400">Satisfied Clients</Text>
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">5★</Text>
              <Text className="text-xs text-gray-600 dark:text-gray-400">Average Rating</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
