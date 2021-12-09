import * as vscode from 'vscode'

export type Delta = {
	changed: number
	removed: number
}

export class State {
	private constructor(
		readonly text: string,
		readonly tooltip: string,
		readonly command: string | undefined = undefined,
	) {}

	static loading = new State('$(folder)$(sync~spin)', 'direnv loading environment…')
	static loaded(delta: Delta) {
		return new State(
			`$(folder-active) +${delta.changed}/-${delta.removed}`,
			`direnv environment loaded: ${delta.changed} changed, ${delta.removed} removed\nReload…`,
			'direnv.reload',
		)
	}
	static empty = new State(
		'$(folder)',
		'direnv environment empty\nCreate…',
		'direnv.create',
	)
	static blocked = new State(
		'$(folder)$(shield)',
		'direnv environment blocked\nReview…',
		'direnv.open',
	)
	static failed = new State(
		'$(folder)$(flame)',
		'direnv failed\nReload…',
		'direnv.reload',
	)
}

export class Item implements vscode.Disposable {
	constructor(private item: vscode.StatusBarItem) {
		item.text = State.empty.text
		item.show()
	}

	dispose() {
		this.item.dispose()
	}

	set state(state: State) {
		this.item.text = state.text
		this.item.tooltip = state.tooltip
		this.item.command = state.command
	}
}
