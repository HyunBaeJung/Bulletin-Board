import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  commonButton: {
    width: '30%',
    marginTop: 10,
    marginBottom: 10,
    borderColor: 'black',
    backgroundColor: 'gray',
    height: 40,
  },

  commonTextInput: {
    width: '60%',
    borderColor: 'black',
    borderWidth: 1,
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },

  topSection: {
    height: '10%',
    width: '95%',
  },
  middleSection: {
    height: '15%',
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomSection: {
    borderTopWidth: 1,
    borderColor: 'gray',
    paddingTop: 20,
    height: '75%',
    width: '95%',
  },
});