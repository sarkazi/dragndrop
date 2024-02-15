import { ActionIcon, Flex, Grid } from '@mantine/core'

import { Group, Text, rem, em } from '@mantine/core'
import { IconUpload, IconPhoto, IconX, IconTrash } from '@tabler/icons-react'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'

import { useCallback, useState } from 'react'

import clsx from 'clsx'

import styles from './styles/app.module.scss'

import { useMediaQuery } from '@mantine/hooks'

function App() {
  const [images, setImages] = useState([])
  const [currentImage, setCurrentImage] = useState({})

  const isMobile = useMediaQuery('(max-width: 750px)')

  console.log(isMobile, 'isMobile')

  const getBase64 = (file, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(file)
  }

  const defineImageData = (prev, key) => {
    if (!prev.length) {
      return 1
    } else {
      const allIds = prev.map((obj) => {
        return obj[key]
      })

      return Math.max.apply(null, allIds) + 1
    }
  }

  const handleChange = useCallback(
    (files) => {
      files.map((file) => {
        getBase64(file, (url) => {
          setImages((prev) => [
            ...prev,
            {
              url,
              id: defineImageData(prev, 'id'),
              position: defineImageData(prev, 'position')
            }
          ])
        })
      })
    },
    [setImages, getBase64, defineImageData]
  )

  const onRemoveImage = useCallback(
    (idToRemove) => {
      setImages((prev) => [...prev.filter((obj) => obj.id !== idToRemove)])
    },
    [setImages]
  )

  const onDragStart = useCallback(
    (image) => {
      setCurrentImage(() => image)
    },
    [setCurrentImage]
  )

  const onDrop = useCallback(
    (event, image) => {
      event.preventDefault()
      setImages((prev) => {
        return prev.map((obj) => {
          if (obj.id === image.id) {
            return { ...obj, position: currentImage.position }
          }
          if (obj.id === currentImage.id) {
            return { ...obj, position: image.position }
          }
          return obj
        })
      })
    },
    [setImages, currentImage]
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
  }, [])

  const onSortAfterDrop = (prev, current) => {
    return prev.position - current.position
  }

  return (
    <div className={styles.gridContainer}>
      <div className={styles.gridCol}>
        <Flex h="100%" justify="center" align="center" flex={true}>
          <Dropzone
            onDrop={handleChange}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            className={styles.dropzone}
          >
            <Group
              justify="center"
              gap="xl"
              mih={220}
              style={{ pointerEvents: 'none' }}
              p={20}
            >
              <Dropzone.Accept>
                <IconUpload
                  style={{
                    width: rem(52),
                    height: rem(52)
                  }}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{
                    width: rem(52),
                    height: rem(52)
                  }}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto
                  style={{
                    width: rem(52),
                    height: rem(52)
                  }}
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag images here or click to select files
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Attach as many files as you like, each file should not exceed
                  5mb
                </Text>
              </div>
            </Group>
          </Dropzone>
        </Flex>
      </div>
      <div className={styles.gridCol}>
        <div className={styles.rightBlock}>
          {images.sort(onSortAfterDrop).map((obj) => (
            <div
              key={obj.id}
              style={{ backgroundImage: `url(${obj.url})` }}
              className={clsx([styles.imageBlock])}
              onDragStart={() => onDragStart(obj)}
              onDrop={(event) => onDrop(event, obj)}
              onDragOver={(event) => onDragOver(event)}
              draggable
            >
              <ActionIcon
                variant="gradient"
                color="rgba(82, 82, 82, 1)"
                radius="xl"
                gradient={{ from: 'teal', to: 'grape', deg: 225 }}
                className={styles.trashIcon}
                size="md"
                onClick={() => onRemoveImage(obj.id)}
              >
                <IconTrash width="17px" />
              </ActionIcon>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
