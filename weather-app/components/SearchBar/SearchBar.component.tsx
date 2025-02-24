import React, { useCallback } from 'react';
import { SearchBarProps } from './SearchBar.types';
import { TextInput, TouchableOpacity, View, Text, FlatList } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { theme } from '@/theme/theme-style';
import { debounce } from 'lodash';

export const SearchBar = ({
    handleTextDebounce, 
    locations, 
    showSearch, 
    toggleSearch, 
    handleLocation, 
    theme }: SearchBarProps): JSX.Element => {
    
    return (
        <View style={{ height: "7%" }} className="mx-4 relative z-50">
        {/* Search Input */}
        <View
          className="flex-row justify-end items-center rounded-full"
          style={{ backgroundColor: theme.bgWhite(0.2) }}
        >
          <TextInput
            onChangeText={handleTextDebounce}
            placeholder="Search city"
            placeholderTextColor={"lightgray"}
            className="pl-6 h-10 pb-1 flex-1 text-base text-white"
          />
          <TouchableOpacity
            onPress={() => toggleSearch(!showSearch)}
            style={{ backgroundColor: theme.bgWhite(0.3) }}
            className="rounded-full p-3 m-1"
          >
            <MagnifyingGlassIcon size="25" color="white" />
          </TouchableOpacity>
        </View>
  
        {/* Search Results */}
        {locations.length > 0 && showSearch ? (
          <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
            <FlatList
              data={locations}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                const showBorder = index + 1 !== locations.length;
                return (
                  <TouchableOpacity
                    onPress={() => handleLocation(item)}
                    key={index}
                    className={`flex-row items-center border-0 p-3 px-4 mb-1 ${showBorder ? "border-b-2 border-b-gray-400" : ""}`}
                  >
                    <MapPinIcon size="20" color="gray" />
                    <Text className="text-black text-lg ml-2">{item.name}, {item.country}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        ) : null}
      </View>
    );
}