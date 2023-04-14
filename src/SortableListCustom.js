// thanhhv
import React, { useEffect, useMemo, useRef } from 'react'
import { Animated, Easing, Platform, StyleSheet } from 'react-native'
import SortableList from './SortableList'

const animationTimeout = Platform.OS == 'ios' ? 300 : 380

const SortableListCustom = ({ data, onChangedData, ...rest }) => {

    const timeout = useRef()

    useEffect(() => {
        return () => {
            if (timeout?.current)
                clearTimeout(timeout.current)
        }
    }, [])

    const onReleaseRow = (key, currentOrder) => {
        const newData = new Array()
        currentOrder.forEach(e => {
            const index = Number(e)
            if (index >= 0 && index < data.length) {
                newData.push(data[index])
            }
        })
        timeout.current = setTimeout(() => {
            onChangedData(newData)
        }, animationTimeout)
    }


    return <SortableList
        style={styles.list}
        data={data}
        onReleaseRow={onReleaseRow}
        {...rest}
    />
}

const SortableListRow = ({ style, active, children }) => {

    const activeAnim = useRef(new Animated.Value(0));
    const _style = useMemo(() => ({
        ...Platform.select({
            ios: {
                transform: [
                    {
                        scale: activeAnim.current.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.07],
                        }),
                    },
                ],
                shadowRadius: activeAnim.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2, 10],
                }),
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowOpacity: 1,
                shadowOffset: { height: 2, width: 2 },
            },

            android: {
                transform: [
                    {
                        scale: activeAnim.current.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.07],
                        }),
                    },
                ],
                elevation: activeAnim.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2, 6],
                }),
                zIndex: active ? 1 : 0
            },
        }),
    }), []);

    useEffect(() => {
        Animated.timing(activeAnim.current, {
            duration: 300,
            easing: Easing.bounce,
            toValue: Number(active),
            useNativeDriver: true,
        }).start();
    }, [active]);

    return (
        <Animated.View style={[_style, style]}>
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1
    },
})

export default SortableListCustom
export { SortableListRow }