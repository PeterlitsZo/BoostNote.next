import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react'
import Icon from '../atoms/Icon'
import styled from '../../lib/styled'
import { mdiTagMultiple, mdiPlus } from '@mdi/js'
import { flexCenter } from '../../lib/styled/styleFunctions'
import { useRouteParams } from '../../lib/routeParams'
import ToolbarButton from '../atoms/ToolbarIconButton'
import TagNavigatorListItem from '../atoms/TagNavigatorListItem'
import TagNavigatorNewTagPopup from '../atoms/TagNavigatorNewTagPopup'
import { useTranslation } from 'react-i18next'

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  overflow: hidden;
`

const IconContainer = styled.div`
  width: 24px;
  height: 24px;
  ${flexCenter}
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.navButtonColor};
`

const TagNavigatorList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  overflow: hidden;
`

interface NoteDetailTagNavigatorProps {
  storageId: string
  storageTags: string[]
  noteId?: string
  tags: string[]
  appendTagByName: (tagName: string) => void
  removeTagByName: (tagName: string) => void
}

const NoteDetailTagNavigator = ({
  storageId,
  storageTags,
  noteId,
  tags,
  appendTagByName,
  removeTagByName,
}: NoteDetailTagNavigatorProps) => {
  const { t } = useTranslation()

  const routeParams = useRouteParams()

  const currentTagName = useMemo(() => {
    if (routeParams.name !== 'storages.tags.show') {
      return null
    }
    return routeParams.tagName
  }, [routeParams])

  const [newTagPopupPosition, setNewTagPopupPosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const closeNewTagPopup = useCallback(() => {
    setNewTagPopupPosition(null)
    if (buttonRef.current == null) {
      return
    }
    buttonRef.current.focus()
  }, [setNewTagPopupPosition])

  const showNewTagPopup = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect != null) {
      setNewTagPopupPosition({ x: rect.x, y: 40 })
    }
  }, [setNewTagPopupPosition])

  useEffect(() => {
    const resizeHandler = () => {
      if (newTagPopupPosition == null) {
        return
      }
      showNewTagPopup()
    }
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [newTagPopupPosition, showNewTagPopup])

  return (
    <>
      <Container>
        <IconContainer title={t('tag.tags')}>
          <Icon path={mdiTagMultiple} />{' '}
        </IconContainer>
        <TagNavigatorList>
          {tags.map((tag) => {
            return (
              <TagNavigatorListItem
                key={tag}
                storageId={storageId}
                noteId={noteId}
                currentTagName={currentTagName}
                tag={tag}
                removeTagByName={removeTagByName}
              />
            )
          })}
        </TagNavigatorList>
        <ToolbarButton
          title={t('tag.add')}
          iconPath={mdiPlus}
          ref={buttonRef}
          onClick={showNewTagPopup}
        />
      </Container>
      {newTagPopupPosition != null && (
        <TagNavigatorNewTagPopup
          position={newTagPopupPosition}
          tags={tags}
          storageTags={storageTags}
          close={closeNewTagPopup}
          appendTagByName={appendTagByName}
        />
      )}
    </>
  )
}

export default NoteDetailTagNavigator
