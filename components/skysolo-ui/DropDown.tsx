// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';

// const SkysoloDropdown = ({ data, placeholder }) => {
//   const [visible, setVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   const toggleDropdown = () => {
//     setVisible(!visible);
//   };

//   const handleItemPress = (item) => {
//     setSelectedItem(item);
//     setVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={toggleDropdown} style={styles.button}>
//         <Text style={styles.buttonText}>{`hi`}</Text>
//       </TouchableOpacity>
//       <Modal visible={visible} transparent={true} animationType="fade">
//         <TouchableOpacity style={styles.overlay} onPress={toggleDropdown} activeOpacity={1}>
//           <View style={styles.dropdown}>
//             <FlatList
//               data={data}
//               keyExtractor={(item) => item.value.toString()}
//               renderItem={({ item }) => (
//                 <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.item}>
//                   <Text>{item.label}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     // Add your container styles here
//   },
//   button: {
//     // Add your button styles here
//   },
//   buttonText: {
//     // Add your button text styles here
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)'
//   },
//   dropdown: {
//     backgroundColor: 'white',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0
//   },
//   item: {
//     padding: 10
//   }
// });

// export default SkysoloDropdown;