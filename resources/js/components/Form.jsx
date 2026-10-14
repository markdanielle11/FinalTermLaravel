/**
 * Form building blocks. Label above the input, error text below it.
 * Errors come from Laravel's server-side validation through Inertia.
 */
export function Field({ label, htmlFor, error, hint, required = false, children, className = '' }) {
    return (
        <div className={`grid content-start gap-1.5 ${className}`}>
            {label && (
                <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
                    {label}
                    {required && <span className="text-bad"> *</span>}
                </label>
            )}
            {children}
            {hint && !error && <p className="text-xs text-ink-3">{hint}</p>}
            {error && (
                <p id={`${htmlFor}-error`} role="alert" className="text-sm text-bad">
                    {error}
                </p>
            )}
        </div>
    );
}

const control =
    'w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-3 transition-colors focus:outline-2 focus:outline-offset-0 focus:outline-accent';

const stateClass = (error) => (error ? 'border-bad' : 'border-line hover:border-ink-3');

export function TextInput({ error, className = '', ref, ...props }) {
    return (
        <input
            ref={ref}
            className={`${control} ${stateClass(error)} ${className}`}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error && props.id ? `${props.id}-error` : undefined}
            {...props}
        />
    );
}

export function TextArea({ error, className = '', rows = 3, ...props }) {
    return (
        <textarea
            rows={rows}
            className={`${control} ${stateClass(error)} ${className}`}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error && props.id ? `${props.id}-error` : undefined}
            {...props}
        />
    );
}

export function Select({ error, className = '', children, ...props }) {
    return (
        <select
            className={`${control} ${stateClass(error)} pr-8 ${className}`}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error && props.id ? `${props.id}-error` : undefined}
            {...props}
        >
            {children}
        </select>
    );
}

/**
 * Binds an input to a useForm() field and clears that field's error
 * as soon as the user edits it (instant feedback after a failed submit).
 */
export function bind(form, name) {
    return {
        id: name,
        name,
        value: form.data[name] ?? '',
        error: form.errors[name],
        onChange: (event) => {
            form.setData(name, event.target.value);
            if (form.errors[name]) {
                form.clearErrors(name);
            }
        },
    };
}
