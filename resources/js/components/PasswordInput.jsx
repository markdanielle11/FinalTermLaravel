import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { TextInput } from './Form';

/**
 * Password field with a show/hide button.
 */
export default function PasswordInput(props) {
    const [visible, setVisible] = useState(false);
    const Icon = visible ? EyeSlashIcon : EyeIcon;

    return (
        <div className="relative">
            <TextInput {...props} type={visible ? 'text' : 'password'} className="pr-10" />
            <button
                type="button"
                onClick={() => setVisible(!visible)}
                aria-label={visible ? 'Hide password' : 'Show password'}
                aria-pressed={visible}
                className="absolute inset-y-0 right-0 grid w-10 place-items-center rounded-r-lg text-ink-3 hover:text-ink"
            >
                <Icon size={18} />
            </button>
        </div>
    );
}
