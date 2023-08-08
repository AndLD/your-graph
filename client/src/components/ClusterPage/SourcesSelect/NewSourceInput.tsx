import { FormInstance, Input } from 'antd'
import React from 'react'
import AddSourceBtn from './AddSourceBtn'

interface INewSourceInputProps {
    form: FormInstance<any>
    newSourceTitleState: [string, React.Dispatch<React.SetStateAction<string>>]
}

export default function NewSourceInput({
    form,
    newSourceTitleState: [newSourceTitle, setNewSourceTitle]
}: INewSourceInputProps) {
    return (
        <Input
            value={newSourceTitle}
            onChange={(e) => setNewSourceTitle(e.target.value)}
            addonAfter={<AddSourceBtn form={form} newSourceTitleState={[newSourceTitle, setNewSourceTitle]} />}
            placeholder="New source"
        />
    )
}
